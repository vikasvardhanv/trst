import crypto from 'crypto';

const base64Url = (input) => {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const parseServiceAccount = () => {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    const parsed = JSON.parse(rawJson);
    return {
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  return {
    clientEmail,
    // Private keys often come in with literal \n in env vars
    privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : privateKey,
  };
};

const getAccessToken = async (scopes) => {
  const { clientEmail, privateKey } = parseServiceAccount();
  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY.');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 60 * 60,
  };

  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey);
  const assertion = `${signingInput}.${base64Url(signature)}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google OAuth token error: ${response.status} ${text}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Google OAuth token error: missing access_token');
  }
  return data.access_token;
};

const googleFetch = async ({ token, url, method = 'GET', body }) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response;
};

const shareAnyoneWithLinkReader = async ({ token, fileId }) => {
  const response = await googleFetch({
    token,
    url: `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/permissions`,
    method: 'POST',
    body: {
      type: 'anyone',
      role: 'reader',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive permissions error: ${response.status} ${text}`);
  }
};

const ensureSheetExists = async ({ token, spreadsheetId, title }) => {
  const metaResponse = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(title))`,
    method: 'GET',
  });

  if (!metaResponse.ok) {
    const text = await metaResponse.text();
    throw new Error(`Sheets metadata error: ${metaResponse.status} ${text}`);
  }

  const meta = await metaResponse.json();
  const hasSheet = (meta.sheets || []).some((s) => s?.properties?.title === title);
  if (hasSheet) return;

  const batchResponse = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
    method: 'POST',
    body: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
            },
          },
        },
      ],
    },
  });

  if (!batchResponse.ok) {
    const text = await batchResponse.text();
    throw new Error(`Sheets addSheet error: ${batchResponse.status} ${text}`);
  }
};

export const createSheetForRecipients = async ({ recipients, title }) => {
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  const createResponse = await googleFetch({
    token,
    url: 'https://sheets.googleapis.com/v4/spreadsheets',
    method: 'POST',
    body: {
      properties: { title },
      sheets: [{ properties: { title: 'Recipients' } }],
    },
  });

  if (!createResponse.ok) {
    const text = await createResponse.text();
    throw new Error(`Sheets create error: ${createResponse.status} ${text}`);
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  const values = [['email'], ...recipients.map((addr) => [addr])];
  const range = `Recipients!A1:A${values.length}`;

  const updateResponse = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    method: 'PUT',
    body: { values },
  });

  if (!updateResponse.ok) {
    const text = await updateResponse.text();
    throw new Error(`Sheets values update error: ${updateResponse.status} ${text}`);
  }

  const shouldShare = String(process.env.CONTACT_EMAIL_MODAL_PUBLIC_SHARE || 'true') !== 'false';
  if (shouldShare) {
    await shareAnyoneWithLinkReader({ token, fileId: spreadsheetId });
  }

  return { spreadsheetId, spreadsheetUrl };
};

export const copyDocTemplateAndInjectDetails = async ({ templateDocId, title, detailsText }) => {
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
  ]);

  const copyResponse = await googleFetch({
    token,
    url: `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(templateDocId)}/copy?fields=id,webViewLink`,
    method: 'POST',
    body: {
      name: title,
      ...(process.env.CONTACT_EMAIL_MODAL_DOC_FOLDER_ID
        ? { parents: [process.env.CONTACT_EMAIL_MODAL_DOC_FOLDER_ID] }
        : {}),
    },
  });

  if (!copyResponse.ok) {
    const text = await copyResponse.text();
    throw new Error(`Drive copy doc error: ${copyResponse.status} ${text}`);
  }

  const copyData = await copyResponse.json();
  const docId = copyData.id;
  const docUrl = copyData.webViewLink || `https://docs.google.com/document/d/${docId}/edit`;

  // Insert details at the beginning of the doc. Index 1 is the start of the body.
  const batchResponse = await googleFetch({
    token,
    url: `https://docs.googleapis.com/v1/documents/${encodeURIComponent(docId)}:batchUpdate`,
    method: 'POST',
    body: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: `${detailsText}\n\n`,
          },
        },
      ],
    },
  });

  if (!batchResponse.ok) {
    const text = await batchResponse.text();
    throw new Error(`Docs batchUpdate error: ${batchResponse.status} ${text}`);
  }

  const shouldShare = String(process.env.CONTACT_EMAIL_MODAL_PUBLIC_SHARE || 'true') !== 'false';
  if (shouldShare) {
    await shareAnyoneWithLinkReader({ token, fileId: docId });
  }

  return { docId, docUrl };
};

export const extractGoogleDocIdFromUrl = (url) => {
  if (!url) return null;
  const match = String(url).match(/\/document\/d\/([^/]+)/);
  return match?.[1] || null;
};

export const extractGoogleSheetIdFromUrl = (url) => {
  if (!url) return null;
  const match = String(url).match(/\/spreadsheets\/d\/([^/]+)/);
  return match?.[1] || null;
};

const ensureSubmissionsSheetAndHeader = async ({ token, spreadsheetId }) => {
  // 1) Ensure the "Submissions" sheet exists
  await ensureSheetExists({ token, spreadsheetId, title: 'Submissions' });

  // 2) Ensure header row exists
  const headerRange = 'Submissions!A1:G1';
  const getHeaderResponse = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(headerRange)}`,
    method: 'GET',
  });

  if (!getHeaderResponse.ok) {
    const text = await getHeaderResponse.text();
    throw new Error(`Sheets header read error: ${getHeaderResponse.status} ${text}`);
  }

  const headerData = await getHeaderResponse.json();
  const existing = headerData.values?.[0] || [];

  const desiredHeader = [
    'submitted_at',
    'lead_id',
    'name',
    'email',
    'company',
    'service',
    'message',
  ];

  const needsHeader =
    existing.length === 0 ||
    desiredHeader.some((h, idx) => (existing[idx] || '').toString().trim() !== h);

  if (needsHeader) {
    const updateHeaderResponse = await googleFetch({
      token,
      url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(headerRange)}?valueInputOption=RAW`,
      method: 'PUT',
      body: {
        values: [desiredHeader],
      },
    });

    if (!updateHeaderResponse.ok) {
      const text = await updateHeaderResponse.text();
      throw new Error(`Sheets header update error: ${updateHeaderResponse.status} ${text}`);
    }
  }
};

export const ensureRecipientsSheetAndValues = async ({ spreadsheetId, recipients }) => {
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  await ensureSheetExists({ token, spreadsheetId, title: 'Recipients' });

  const normalized = (recipients || []).map((r) => String(r).trim()).filter(Boolean);
  const values = [['email'], ...normalized.map((addr) => [addr])];
  const range = `Recipients!A1:A${values.length}`;

  const updateResponse = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    method: 'PUT',
    body: { values },
  });

  if (!updateResponse.ok) {
    const text = await updateResponse.text();
    throw new Error(`Sheets recipients update error: ${updateResponse.status} ${text}`);
  }
};

export const appendSubmissionToSheet = async ({ spreadsheetId, values }) => {
  const token = await getAccessToken([
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  await ensureSubmissionsSheetAndHeader({ token, spreadsheetId });

  const response = await googleFetch({
    token,
    url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent('Submissions!A1')}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    body: {
      values: [values],
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sheets append error: ${response.status} ${text}`);
  }
};

