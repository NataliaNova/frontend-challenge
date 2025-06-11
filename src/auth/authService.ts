function base64URLEncode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(digest);
}

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => ("0" + byte.toString(16)).slice(-2)).join("");
}

const CLIENT_ID = "c178e05302784f728f383d37dc440c49";
const REDIRECT_URI =
  import.meta.env.VITE_REDIRECT_URI || (window.location.origin + "/callback");

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPE = "user-read-private user-read-email";

export function handleSessionExpired() {
  localStorage.clear();
  alert("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
  window.location.href = "/login";
}


export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  console.log('Guardando code_verifier:', codeVerifier);
  localStorage.setItem("code_verifier", codeVerifier);

 
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log('Generado code_challenge:', codeChallenge);


  const url =
    `${AUTH_ENDPOINT}?` +
    `client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  console.log('Redirigiendo a Spotify con URL:', url);

  window.location.href = url;
}


export async function exchangeToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem("code_verifier");
  console.log('Recuperando code_verifier:', codeVerifier);

  if (!codeVerifier) throw new Error("Code verifier not found");


  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  console.log("Enviando body al /api/token:", Object.fromEntries(body.entries()));


  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  console.log("Respuesta de Spotify /api/token:", data);

  if (!data.access_token) throw new Error("Token exchange failed");

  localStorage.removeItem("code_verifier");

  return data.access_token;
}
