import { useState, useEffect } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_token");
    setToken(storedToken);
  }, []);

  return { token };
}
