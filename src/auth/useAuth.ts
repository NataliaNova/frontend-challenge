import { useState, useEffect } from "react";
import { REDIRECT_URI } from '../config';


export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_token");
    setToken(storedToken);
  }, []);

  return { token };
}
