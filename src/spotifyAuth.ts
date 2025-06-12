// src/spotifyAuth.ts

const CLIENT_ID = "c178e05302784f728f383d37dc440c49"; 
const REDIRECT_URI = "http://127.0.0.1:5173/callback"; 

const SCOPE = "user-read-private user-read-email";

// Genera un code_verifier aleatorio
function generateCodeVerifier(length = 128): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let verifier = '';
  for (let i = 0; i < length; i++) {
    verifier += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return verifier;
}

// Convierte el code_verifier en code_challenge
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToAuth() {
  const codeVerifier = generateCodeVerifier();
  localStorage.setItem("verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem("verifier");
  if (!codeVerifier) throw new Error("Code verifier not found!");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Token exchange failed: " + (data.error_description || ""));
  localStorage.removeItem("verifier");
  return data.access_token;
}
