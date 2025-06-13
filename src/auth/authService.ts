function base64URLEncode(digest: ArrayBuffer): string {
return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))))
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

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPE = "user-read-private user-read-email";

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  localStorage.setItem("code_verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const url =
    `${AUTH_ENDPOINT}?` +
    `client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}`;

  window.location.href = url;
}

export async function exchangeToken(code: string): Promise<string> {
  const code_verifier = localStorage.getItem("code_verifier");
  if (!code_verifier) throw new Error("Code verifier not found");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();
  if (!data.access_token) throw new Error("Token exchange failed: " + (data.error_description || ""));

  localStorage.removeItem("code_verifier");
  return data.access_token;
}


  
