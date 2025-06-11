import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("code_verifier"); 
      sessionStorage.clear();
    navigate("/login");
  }

  return logout;
}