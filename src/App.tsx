import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "./pages/Login";
import NewReleases from "./pages/NewReleases";
import { exchangeToken } from "./auth/authService";

function CallbackHandler() {
  const navigate = useNavigate();
  const hasExchanged = useRef(false); // 👈 Esto es la clave

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("Código recibido en callback:", code);

    // Solo intentamos hacer el exchange si no lo hemos hecho ya
    if (code && !hasExchanged.current) {
      hasExchanged.current = true; // Marcamos como ya usado
      exchangeToken(code)
        .then((accessToken) => {
          localStorage.setItem("spotify_token", accessToken);
          navigate("/");
        })
        .catch((err) => {
          console.error("Token exchange failed", err);
          navigate("/login");
        });
    } else if (!code) {
      navigate("/login");
    }
  }, [navigate]);

  return <p className="text-white p-4">⏳ Autenticando con Spotify...</p>;
}

function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("spotify_token");
    console.log("Token desde localStorage:", stored);
    setToken(stored);
  }, []);

  return { token };
}

export default function App() {
  const { token } = useToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/callback" element={<CallbackHandler />} />
        <Route
          path="/"
          element={token ? <NewReleases token={token} /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
