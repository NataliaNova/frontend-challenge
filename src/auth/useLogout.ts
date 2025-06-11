import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();

  function logout() {
    sessionStorage.removeItem("spotify_token");
    sessionStorage.removeItem("code_verifier"); 
    sessionStorage.clear();
    navigate("/login");
  }

  return logout;
}