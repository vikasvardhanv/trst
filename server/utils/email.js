const parseRecipientList = (value) => {
  return (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const getContactNotificationRecipients = () => {
  const configured = parseRecipientList(process.env.CONTACT_NOTIFY_EMAILS);
  if (configured.length > 0) return configured;

  return ['info@highshiftmedia.com', 'tech@highshiftmedia.com'];
};

const escapeText = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendContactNotificationEmail = async ({
  leadId,
  name,
  email,
  company,
  service,
  message,
}) => {
  const recipients = getContactNotificationRecipients();
  const from = process.env.CONTACT_FROM_EMAIL || 'Highshift Media <info@highshiftmedia.com>';

  const subject = `New website message${service ? ` (${service})` : ''}: ${name}`;

  const text = [
    'New contact form submission',
    `Lead ID: ${leadId ?? 'N/A'}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'N/A'}`,
    `Interested In: ${service || 'N/A'}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">New contact form submission</h2>
      <p style="margin: 0 0 12px; color: #334155;">A new message was sent from the website contact form.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 6px 0; font-weight: 600; width: 140px;">Lead ID</td><td style="padding: 6px 0;">${escapeText(leadId ?? 'N/A')}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Name</td><td style="padding: 6px 0;">${escapeText(name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeText(email)}">${escapeText(email)}</a></td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Company</td><td style="padding: 6px 0;">${escapeText(company || 'N/A')}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Interested In</td><td style="padding: 6px 0;">${escapeText(service || 'N/A')}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <h3 style="margin: 0 0 8px;">Message</h3>
      <pre style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${escapeText(message)}</pre>
    </div>
  `;

  // Provider: Modal (sheet + template)
  // Keep the Modal API body generic: {sheet_url, template_url, limit, dry_run, validate}.
  // We handle "fill the sheet" + "copy/fill the doc" separately before calling Modal.
  if (process.env.CONTACT_EMAIL_MODAL_ENDPOINT) {
    const endpoint = process.env.CONTACT_EMAIL_MODAL_ENDPOINT;
    const sheet_url = process.env.CONTACT_EMAIL_MODAL_SHEET_URL;
    const baseTemplateUrl = process.env.CONTACT_EMAIL_MODAL_TEMPLATE_URL;

    if (!sheet_url) {
      throw new Error('Modal email configured but missing CONTACT_EMAIL_MODAL_SHEET_URL');
    }
    if (!baseTemplateUrl) {
      throw new Error('Modal email configured but missing CONTACT_EMAIL_MODAL_TEMPLATE_URL');
    }

    const limit = Number(process.env.CONTACT_EMAIL_MODAL_LIMIT || recipients.length || 2);
    const dry_run = String(process.env.CONTACT_EMAIL_MODAL_DRY_RUN || 'false') === 'true';
    const validate = String(process.env.CONTACT_EMAIL_MODAL_VALIDATE || 'true') !== 'false';

    const {
      extractGoogleDocIdFromUrl,
      extractGoogleSheetIdFromUrl,
      copyDocTemplateAndInjectDetails,
      appendSubmissionToSheet,
      ensureRecipientsSheetAndValues,
    } = await import('./googleModalAssets.js');
    const { sendViaModalEmailApi } = await import('./modalEmailApi.js');

    // 1) Append to shared sheet (Submissions tab)
    const spreadsheetId = extractGoogleSheetIdFromUrl(sheet_url);
    if (!spreadsheetId) {
      throw new Error('CONTACT_EMAIL_MODAL_SHEET_URL must be a Google Sheets URL like https://docs.google.com/spreadsheets/d/<id>/edit');
    }

    const createdAt = new Date().toISOString();

    // Ensure the sheet contains a Recipients tab for generic Modal sends
    await ensureRecipientsSheetAndValues({
      spreadsheetId,
      recipients,
    });

    await appendSubmissionToSheet({
      spreadsheetId,
      values: [
        createdAt,
        leadId ?? '',
        name,
        email,
        company || '',
        service || '',
        message,
      ],
    });

    // 2) Copy the template doc and inject details
    const templateDocId = extractGoogleDocIdFromUrl(baseTemplateUrl);
    if (!templateDocId) {
      throw new Error('CONTACT_EMAIL_MODAL_TEMPLATE_URL must be a Google Docs URL like https://docs.google.com/document/d/<id>/edit');
    }

    const titleSuffix = `${(leadId ?? 'contact').toString()} ${createdAt.replace(/[:.]/g, '-')}`;
    const docTitle = `Contact Message ${titleSuffix}`;
    const detailsText = [
      'New contact form submission',
      `Lead ID: ${leadId ?? 'N/A'}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'N/A'}`,
      `Interested In: ${service || 'N/A'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const { docUrl } = await copyDocTemplateAndInjectDetails({
      templateDocId,
      title: docTitle,
      detailsText,
    });

    // 3) Call Modal email API (exact body shape)
    return await sendViaModalEmailApi({
      endpoint,
      sheet_url,
      template_url: docUrl,
      limit,
      dry_run,
      validate,
    });
  }

  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: recipients.map((addr) => ({ email: addr })),
            subject,
          },
        ],
        from: (() => {
          // Accept either "Name <email>" or plain email.
          const match = from.match(/^(.*)<([^>]+)>\s*$/);
          if (match) {
            return { name: match[1].trim(), email: match[2].trim() };
          }
          return { email: from };
        })(),
        reply_to: { email },
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`SendGrid error: ${response.status} ${errText}`);
    }

    return { provider: 'sendgrid' };
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        text,
        html,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Resend error: ${response.status} ${errText}`);
    }

    return { provider: 'resend' };
  }

  throw new Error('No email provider configured. Set CONTACT_EMAIL_MODAL_ENDPOINT (recommended) or SENDGRID_API_KEY or RESEND_API_KEY.');
};
