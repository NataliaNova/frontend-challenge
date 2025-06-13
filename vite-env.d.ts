declare module '*.css' {
  const content: Record<string, string>;
  
}


interface ImportMetaEnv {
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}