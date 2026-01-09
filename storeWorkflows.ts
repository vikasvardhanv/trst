export type StoreWorkflow = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  includes: string[];
  tags: string[];
  contactSubject: string;
};

export const STORE_WORKFLOWS: StoreWorkflow[] = [
  {
    id: 'lead-to-crm',
    name: 'Lead Capture → CRM (with enrichment)',
    description:
      'Captures leads from forms/webhooks, enriches with company data, deduplicates, and pushes into your CRM with clean fields and UTM tracking.',
    priceLabel: 'From $299',
    includes: ['n8n workflow JSON', 'Setup guide', 'Webhook + CRM mapping', 'Dedup + retries'],
    tags: ['CRM', 'Leads', 'Webhook', 'Enrichment'],
    contactSubject: 'Store: Lead Capture → CRM',
  },
  {
    id: 'google-drive-invoice',
    name: 'Invoice Intake Automation (Drive → Slack/Email)',
    description:
      'Watches a Drive folder, extracts metadata, routes invoices to the right channel, and creates a searchable record for your finance process.',
    priceLabel: 'From $249',
    includes: ['n8n workflow JSON', 'Setup guide', 'Drive watcher', 'Notifications + logging'],
    tags: ['Ops', 'Finance', 'Google Drive', 'Slack'],
    contactSubject: 'Store: Invoice Intake Automation',
  },
  {
    id: 'support-triage',
    name: 'Support Triage (Email → Ticket + Priority)',
    description:
      'Turns inbound support emails into structured tickets, classifies priority, and routes to the correct queue with SLA-friendly alerts.',
    priceLabel: 'From $349',
    includes: ['n8n workflow JSON', 'Setup guide', 'Routing rules', 'SLA alerting'],
    tags: ['Support', 'Email', 'Routing', 'SLA'],
    contactSubject: 'Store: Support Triage Workflow',
  },
  {
    id: 'whatsapp-appointments',
    name: 'WhatsApp → Appointment Booking Pipeline',
    description:
      'Captures WhatsApp inquiries, qualifies intent, and routes to scheduling with confirmations and follow-ups logged to Sheets.',
    priceLabel: 'From $399',
    includes: ['n8n workflow JSON', 'Setup guide', 'Follow-up sequences', 'Google Sheets logging'],
    tags: ['WhatsApp', 'Scheduling', 'Leads', 'Sheets'],
    contactSubject: 'Store: WhatsApp → Appointment Booking',
  },
];
