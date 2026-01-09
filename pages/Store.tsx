import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { parseN8nWorkflowReadme, type N8nStoreCategory, type N8nStoreWorkflow } from '../utils/n8nReadmeStore';
import { ShoppingCart, Tags, ArrowRight, Download, ChevronRight, AlertTriangle } from 'lucide-react';

const getDownloadBaseUrl = () => {
  // @ts-ignore - Vite env
  const base = (import.meta.env.VITE_WORKFLOW_DOWNLOAD_BASE_URL as string | undefined) || '/workflows/';
  return base.endsWith('/') ? base : `${base}/`;
};

const encodeFile = (fileName: string) => encodeURIComponent(fileName);
const decodeFile = (encoded: string) => decodeURIComponent(encoded);

const findWorkflow = (categories: N8nStoreCategory[], categorySlug: string, fileName: string) => {
  const category = categories.find((c) => c.slug === categorySlug);
  const workflow = category?.workflows.find((w) => w.fileName === fileName);
  return { category, workflow };
};

export const Store: React.FC = () => {
  const { categorySlug, workflowFile } = useParams();
  const [readme, setReadme] = useState<string>('');
  const [readmeError, setReadmeError] = useState<string>('');
  const [downloadAvailable, setDownloadAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setReadmeError('');
      try {
        const res = await fetch('/README.md', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Failed to load README.md (${res.status})`);
        const text = await res.text();
        if (!cancelled) setReadme(text);
      } catch (e: any) {
        if (!cancelled) setReadmeError(e?.message || 'Failed to load workflow catalog');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => (readme ? parseN8nWorkflowReadme(readme) : []), [readme]);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => c.slug === categorySlug) || null;
  }, [categories, categorySlug]);

  const selectedWorkflow: N8nStoreWorkflow | null = useMemo(() => {
    if (!categorySlug || !workflowFile) return null;
    const fileName = decodeFile(workflowFile);
    return findWorkflow(categories, categorySlug, fileName).workflow || null;
  }, [categories, categorySlug, workflowFile]);

  const downloadUrl = useMemo(() => {
    if (!selectedWorkflow) return null;
    return `${getDownloadBaseUrl()}${encodeFile(selectedWorkflow.fileName)}`;
  }, [selectedWorkflow]);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      setDownloadAvailable(null);
      if (!downloadUrl) return;
      try {
        const res = await fetch(downloadUrl, { method: 'HEAD' });
        if (!cancelled) setDownloadAvailable(res.ok);
      } catch {
        if (!cancelled) setDownloadAvailable(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [downloadUrl]);

  return (
    <Layout>
      <SEO
        title="Store | Highshift Media"
        description="Browse categorized n8n workflows. View details and download workflow JSON."
      />

      <div className="pt-24">
        <AnimatedSection className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                <ShoppingCart className="h-4 w-4 text-sky-400" />
                n8n workflow store
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white">
                <GradientText>Workflows</GradientText> you can ship today
              </h1>

              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Browse workflows by category, open a workflow to see details, and download the JSON to import into n8n.
              </p>

              <div className="mt-8 flex flex-row gap-3 overflow-x-auto">
                <Link to="/demos/workflow-automation">
                  <Button variant="primary" size="lg" className="whitespace-nowrap">
                    See automation demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="whitespace-nowrap">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {readmeError ? (
              <GlassCard className="p-6">
                <div className="flex items-start gap-3 text-white/80">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Could not load workflow catalog</div>
                    <div className="mt-1 text-sm text-white/60">{readmeError}</div>
                  </div>
                </div>
              </GlassCard>
            ) : workflowFile && selectedWorkflow && selectedCategory ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/50">Workflow</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{selectedWorkflow.name}</h2>
                    <div className="mt-2 text-sm text-white/60">$39</div>
                    {selectedWorkflow.description ? (
                      <p className="mt-3 text-white/70 leading-relaxed">{selectedWorkflow.description}</p>
                    ) : (
                      <p className="mt-3 text-white/50">No description provided.</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <Link to={`/store/${selectedCategory.slug}`}>
                      <Button variant="secondary" size="md">
                        Back
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Tags className="h-4 w-4 text-sky-400" />
                    Key Integrations
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedWorkflow.integrations.length ? selectedWorkflow.integrations : ['—']).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  {downloadUrl && downloadAvailable !== false ? (
                    <a href={downloadUrl} download>
                      <Button variant="primary" size="md">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  ) : (
                    <Button variant="primary" size="md" disabled>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}

                  <Link to="/contact">
                    <Button variant="secondary" size="md">
                      Need help importing?
                    </Button>
                  </Link>
                </div>

                {downloadUrl && downloadAvailable === false && (
                  <div className="mt-3 text-sm text-white/50">
                    This workflow file isn’t hosted yet. Add the JSON under public/workflows (or set VITE_WORKFLOW_DOWNLOAD_BASE_URL to your hosted location).
                  </div>
                )}
              </GlassCard>
            ) : selectedCategory ? (
              <>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm text-white/50">Category</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{selectedCategory.title}</h2>
                    <div className="mt-1 text-sm text-white/50">
                      {selectedCategory.workflows.length} workflows listed
                    </div>
                  </div>
                  <Link to="/store">
                    <Button variant="secondary" size="md">All categories</Button>
                  </Link>
                </div>

                <StaggerContainer>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCategory.workflows.map((w) => (
                      <StaggerItem key={`${w.categorySlug}:${w.fileName}`}>
                        <Link to={`/store/${selectedCategory.slug}/${encodeFile(w.fileName)}`}>
                          <GlassCard className="p-5 hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-lg font-semibold text-white">{w.name}</div>
                                <div className="mt-1 text-sm text-white/60 line-clamp-2">{w.description || 'No description provided.'}</div>
                                {!!w.integrations.length && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {w.integrations.slice(0, 6).map((tag) => (
                                      <span
                                        key={`${w.fileName}:${tag}`}
                                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="shrink-0 flex items-center gap-3">
                                <div className="text-sm font-semibold text-white">$39</div>
                                <ChevronRight className="h-5 w-5 text-white/40" />
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>

                <div className="mt-10">
                  <GlassCard className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">Custom</div>
                        <div className="mt-1 text-xl font-semibold text-white">Need a custom workflow?</div>
                        <div className="mt-2 text-sm text-white/60">
                          Tell us what you want to automate and we’ll build it in n8n.
                        </div>
                      </div>
                      <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                        <Button variant="primary" size="md" className="whitespace-nowrap">
                          Contact for custom workflow
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>
              </>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <StaggerItem key={cat.slug}>
                      <Link to={`/store/${cat.slug}`}>
                        <GlassCard className="h-full p-6 hover:bg-white/10 transition-colors">
                          <div className="text-sm text-white/50">Category</div>
                          <div className="mt-2 text-xl font-semibold text-white">{cat.title}</div>
                          <div className="mt-2 text-sm text-white/60">
                            {(cat.count ?? cat.workflows.length).toLocaleString()} workflows
                          </div>
                        </GlassCard>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>

                <div className="mt-10">
                  <GlassCard className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">Custom</div>
                        <div className="mt-1 text-xl font-semibold text-white">Need a custom workflow?</div>
                        <div className="mt-2 text-sm text-white/60">
                          Tell us what you want to automate and we’ll build it in n8n.
                        </div>
                      </div>
                      <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                        <Button variant="primary" size="md" className="whitespace-nowrap">
                          Contact for custom workflow
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>
              </StaggerContainer>
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};
