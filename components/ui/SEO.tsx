import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Highshift Media | Premier AI Automation & Development Agency',
  description = 'Transform your business with Highshift Media. We specialize in custom AI agents, chatbots, marketing automation, and enterprise LLM integration. The #1 AI Agency for modern businesses.',
  keywords = 'AI Agency, Artificial Intelligence, Automation, Chatbots, LLM, Machine Learning, Business Automation, Marketing AI, Highshift Media',
  image = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop', // Futuristic AI placeholder
  url = 'https://highshift.media',
  type = 'website',
  schema
}) => {
  const siteTitle = title.includes('Highshift') ? title : `${title} | Highshift Media`;

  // Default Organization Schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Highshift Media",
    "url": "https://highshift.media",
    "logo": "https://highshift.media/logo.png",
    "sameAs": [
      "https://twitter.com/highshiftmedia",
      "https://linkedin.com/company/highshiftmedia"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service"
    },
    "description": description
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};
