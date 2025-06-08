import { redirectToSpotifyAuth } from "../auth/authService";

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={redirectToSpotifyAuth}
        className="px-6 py-3 bg-green-500 text-black rounded-xl font-semibold hover:bg-green-400"
      >
        Login with Spotify
      </button>
    </div>
  );
}
 