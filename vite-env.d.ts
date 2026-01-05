/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_APPLE_CLIENT_ID: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_VIDEO_DISCOVERY: string;
  readonly VITE_VIDEO_STRATEGY: string;
  readonly VITE_VIDEO_DEVELOPMENT: string;
  readonly VITE_VIDEO_OPTIMIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
