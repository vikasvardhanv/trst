import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { useAuth, getAuthToken } from '../context/AuthContext';
import { ShoppingCart, Tags, ArrowRight, Download, ChevronRight, AlertTriangle, Loader2, CreditCard } from 'lucide-react';

// Placeholder Stripe link - replace with actual Stripe payment link
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/PLACEHOLDER';

type StoreCategory = {
  slug: string;
  title: string;
  count: number;
};

type StoreWorkflow = {
  id?: string;
  categorySlug: string;
  categoryTitle: string;
  workflowSlug: string;
  name: string;
  fileName: string;
  description: string;
  integrations: string[];
  priceCents: number;
  currency: string;
  hasJson?: boolean;
};

type StoreCategoryDetail = {
  slug: string;
  title: string;
  count: number;
  workflows: StoreWorkflow[];
};

const getApiBaseUrl = () => {
  // @ts-ignore - Vite env
  return (import.meta.env.VITE_API_URL as string | undefined) || '/api';
};

const encodeFile = (fileName: string) => encodeURIComponent(fileName);
const decodeFile = (encoded: string) => decodeURIComponent(encoded);

export const Store: React.FC = () => {
  const { categorySlug, workflowFile } = useParams();
  const { isAuthenticated, setShowAuthModal, setAuthModalMode } = useAuth();
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<StoreCategoryDetail | null>(null);
  const [workflowDetail, setWorkflowDetail] = useState<{ category: { slug: string; title: string }; workflow: StoreWorkflow } | null>(null);
  const [storeError, setStoreError] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStoreError('');
      setCategoryDetail(null);
      setWorkflowDetail(null);

      const apiBase = getApiBaseUrl();

      try {
        if (!categorySlug) {
          const res = await fetch(`${apiBase}/store/categories`, { cache: 'no-cache' });
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load store categories (${res.status})`);
          }
          if (!cancelled) setCategories(Array.isArray(json.data) ? json.data : []);
          return;
        }

        if (categorySlug && !workflowFile) {
          const res = await fetch(`${apiBase}/store/categories/${encodeURIComponent(categorySlug)}`, { cache: 'no-cache' });
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load category (${res.status})`);
          }
          if (!cancelled) setCategoryDetail(json.data);
          return;
        }

        if (categorySlug && workflowFile) {
          const res = await fetch(
            `${apiBase}/store/workflows/${encodeURIComponent(categorySlug)}/${encodeURIComponent(decodeFile(workflowFile))}`,
            { cache: 'no-cache' }
          );
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load workflow (${res.status})`);
          }
          if (!cancelled) setWorkflowDetail(json.data);
          return;
        }
      } catch (e: any) {
        if (!cancelled) setStoreError(e?.message || 'Failed to load store catalog');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, workflowFile]);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) return null;
    if (workflowFile && workflowDetail?.category) return workflowDetail.category;
    if (categoryDetail) return { slug: categoryDetail.slug, title: categoryDetail.title };
    return null;
  }, [categorySlug, workflowFile, workflowDetail, categoryDetail]);

  const selectedWorkflow: StoreWorkflow | null = useMemo(() => {
    if (!categorySlug || !workflowFile) return null;
    return workflowDetail?.workflow || null;
  }, [categorySlug, workflowFile, workflowDetail]);

  // Secure download handler: requires auth, fetches one-time token, triggers download
  const handleDownload = async () => {
    if (!selectedWorkflow?.id) return;

    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    setDownloading(true);
    setDownloadError('');

    const apiBase = getApiBaseUrl();

    try {
      // Step 1: Request a one-time download token
      const authToken = getAuthToken();
      const tokenRes = await fetch(`${apiBase}/store/download-token/${selectedWorkflow.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const tokenJson = await tokenRes.json().catch(() => null);
      if (!tokenRes.ok || !tokenJson?.success) {
        throw new Error(tokenJson?.message || 'Failed to get download token');
      }

      // Step 2: Trigger the download via the token endpoint
      const downloadToken = tokenJson.data.token;
      window.location.href = `${apiBase}/store/download/${downloadToken}`;
    } catch (e: any) {
      setDownloadError(e?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

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
            {storeError ? (
              <GlassCard className="p-6">
                <div className="flex items-start gap-3 text-white/80">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Could not load workflow catalog</div>
                    <div className="mt-1 text-sm text-white/60">{storeError}</div>
                  </div>
                </div>
              </GlassCard>
            ) : workflowFile && selectedWorkflow && selectedCategory ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/50">Workflow</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{selectedWorkflow.name}</h2>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-3xl font-bold text-sky-400">$39</span>
                      <span className="text-sm text-white/50">one-time purchase</span>
                    </div>
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
                  {selectedWorkflow.hasJson ? (
                    <>
                      <a
                        href={`${STRIPE_PAYMENT_LINK}?client_reference_id=${selectedWorkflow.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="primary" size="lg">
                          <CreditCard className="h-4 w-4" />
                          Buy Now — $39
                        </Button>
                      </a>
                      {isAuthenticated && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={handleDownload}
                          disabled={downloading}
                        >
                          {downloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download (if purchased)
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button variant="primary" size="lg" disabled>
                      <CreditCard className="h-4 w-4" />
                      Coming soon — $39
                    </Button>
                  )}

                  <Link to="/contact">
                    <Button variant="secondary" size="md">
                      Need help importing?
                    </Button>
                  </Link>
                </div>

                {downloadError && (
                  <div className="mt-3 text-sm text-red-400">{downloadError}</div>
                )}

              </GlassCard>
            ) : categoryDetail ? (
              <>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm text-white/50">Category</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{categoryDetail.title}</h2>
                    <div className="mt-1 text-sm text-white/50">
                      {categoryDetail.workflows.length} workflows listed
                    </div>
                  </div>
                  <Link to="/store">
                    <Button variant="secondary" size="md">All categories</Button>
                  </Link>
                </div>

                <StaggerContainer>
                  <div className="grid grid-cols-1 gap-4">
                    {categoryDetail.workflows.map((w) => (
                      <StaggerItem key={`${w.categorySlug}:${w.fileName}`}>
                        <Link to={`/store/${categoryDetail.slug}/${encodeFile(w.fileName)}`}>
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
                              <div className="shrink-0 flex flex-col items-end gap-1">
                                <div className="text-lg font-bold text-sky-400">$39</div>
                                <div className="flex items-center gap-1 text-xs text-white/50">
                                  <CreditCard className="h-3 w-3" />
                                  Buy now
                                </div>
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
                            {(cat.count ?? 0).toLocaleString()} workflows
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
