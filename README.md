🎧 DevSoulify – Frontend Challenge
This project is a frontend-only React app using the Spotify Web API to display new music releases and featured playlists.

Features:

Spotify login (OAuth2 PKCE, no backend)

Shows “New Releases” and “Featured Playlists” from Spotify

Responsive, clean UI (React + Tailwind CSS)

Logout button

Unit tests with Jest & Testing Library

Getting Started

1. Clone the repo
   bash
   Copiar
   Editar
   git clone https://github.com/NataliaNova/frontend-challenge.git
   cd frontend-challenge
2. Install dependencies
   bash
   Copiar
   Editar
   npm install
3. Set up environment variables
   Create a .env file in the root with:

env
Copiar
Editar
VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id
VITE_REDIRECT_URI=http://127.0.0.1:5173/callback
Get your Spotify client id at https://developer.spotify.com/dashboard/applications

Add http://127.0.0.1:5173/callback to your Spotify app’s Redirect URIs

4. Run the app locally
   bash
   Copiar
   Editar
   npm run dev
   Open http://127.0.0.1:5173 in your browser.

5. Run tests
   bash
   Copiar
   Editar
   npm test
   Author
   Natalia Trujillo – @NataliaNova
