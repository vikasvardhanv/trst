export type N8nStoreCategory = {
  title: string;
  slug: string;
  count?: number;
  workflows: N8nStoreWorkflow[];
};

export type N8nStoreWorkflow = {
  name: string;
  fileName: string;
  description: string;
  integrations: string[];
  categorySlug: string;
};

const normalizeSlug = (slug: string) =>
  slug
    .trim()
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');

const parseCount = (text: string): number | undefined => {
  const match = text.match(/\((\d+)\s+workflows\)/i);
  if (!match) return undefined;
  const num = Number(match[1]);
  return Number.isFinite(num) ? num : undefined;
};

const parseMarkdownLink = (cell: string): { text: string; href: string } | null => {
  const match = cell.match(/^\[(.*)\]\((.*)\)$/);
  if (!match) return null;
  return { text: match[1].trim(), href: match[2].trim() };
};

export const parseN8nWorkflowReadme = (markdown: string): N8nStoreCategory[] => {
  const lines = markdown.split(/\r?\n/);

  const categoriesFromIndex: Array<{ title: string; slug: string; count?: number }> = [];
  let inCategoryIndex = false;

  for (const line of lines) {
    if (line.trim() === '## Categories') {
      inCategoryIndex = true;
      continue;
    }

    if (inCategoryIndex) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('---')) break;

      const match = trimmed.match(/^\-\s+\[(.+?)\]\(#(.+?)\)\s*(.*)$/);
      if (match) {
        const title = match[1].trim();
        const slug = normalizeSlug(match[2]);
        const count = parseCount(match[3] || '');
        categoriesFromIndex.push({ title, slug, count });
      }
    }
  }

  // Map: category slug -> workflows parsed from that section
  const workflowsByCategory = new Map<string, N8nStoreWorkflow[]>();

  let currentCategoryTitle: string | null = null;
  let currentCategorySlug: string | null = null;

  const findSlugForHeading = (heading: string) => {
    const existing = categoriesFromIndex.find((c) => c.title === heading);
    if (existing) return existing.slug;
    // best-effort
    return normalizeSlug(heading);
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // New category section
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      if (heading.toLowerCase() === 'categories') continue;

      currentCategoryTitle = heading;
      currentCategorySlug = findSlugForHeading(heading);
      if (!workflowsByCategory.has(currentCategorySlug)) workflowsByCategory.set(currentCategorySlug, []);
      continue;
    }

    if (!currentCategorySlug || !currentCategoryTitle) continue;

    // Table rows in <details> blocks
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cells = trimmed
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());

    // Expect table with 3 columns
    if (cells.length < 3) continue;

    // Skip header rows
    if (cells[0] === 'Workflow Name' || cells[0] === '---') continue;
    if (cells[0].startsWith('---')) continue;

    const link = parseMarkdownLink(cells[0]);
    if (!link) continue;

    const description = cells[1] || '';
    const integrations = (cells[2] || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    const workflow: N8nStoreWorkflow = {
      name: link.text,
      fileName: link.href,
      description,
      integrations,
      categorySlug: currentCategorySlug,
    };

    workflowsByCategory.get(currentCategorySlug)!.push(workflow);
  }

  const categories: N8nStoreCategory[] = categoriesFromIndex.map((c) => ({
    ...c,
    workflows: workflowsByCategory.get(c.slug) || [],
  }));

  // Include any categories that exist as headings but not in the index (best-effort)
  for (const [slug, workflows] of workflowsByCategory.entries()) {
    if (categories.some((c) => c.slug === slug)) continue;
    categories.push({ title: slug, slug, workflows });
  }

  return categories;
};
