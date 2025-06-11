function base64URLEncode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
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

// CAMBIA SOLO ESTO SEGÚN ENTORNO
const CLIENT_ID = "c178e05302784f728f383d37dc440c49";
// Usa la URL de Vercel en producción
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

// ---------- AUTENTICACIÓN ----------
export async function redirectToSpotifyAuth() {
  // 1. Generar y guardar el code_verifier
  const codeVerifier = generateRandomString(64);
  console.log('Guardando code_verifier:', codeVerifier);
  localStorage.setItem("code_verifier", codeVerifier);

  // 2. Crear el code_challenge y loguear
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log('Generado code_challenge:', codeChallenge);

  // 3. Construir la URL de autenticación y redirigir
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

// ---------- INTERCAMBIO DEL CODE POR EL TOKEN ----------
export async function exchangeToken(code: string): Promise<string> {
  const codeVerifier = localStorage.getItem("code_verifier");
  console.log('Recuperando code_verifier:', codeVerifier);

  if (!codeVerifier) throw new Error("Code verifier not found");

  // Construye el body y loguea TODO lo que mandas
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  console.log("Enviando body al /api/token:", Object.fromEntries(body.entries()));

  // Llama al endpoint de token y loguea la respuesta
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  console.log("Respuesta de Spotify /api/token:", data);

  if (!data.access_token) throw new Error("Token exchange failed");

  // Limpia el code_verifier solo después de obtener el token
  localStorage.removeItem("code_verifier");

  return data.access_token;
}
