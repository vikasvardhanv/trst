export const sendViaModalEmailApi = async ({
  endpoint,
  sheet_url,
  template_url,
  limit,
  dry_run,
  validate,
}) => {
  if (!endpoint) throw new Error('Modal email API endpoint is required');
  if (!sheet_url) throw new Error('sheet_url is required');
  if (!template_url) throw new Error('template_url is required');

  const body = {
    sheet_url,
    template_url,
    ...(typeof limit === 'number' ? { limit } : {}),
    ...(typeof dry_run === 'boolean' ? { dry_run } : {}),
    ...(typeof validate === 'boolean' ? { validate } : {}),
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Modal email API error: ${response.status} ${errText}`);
  }

  return { provider: 'modal' };
};
