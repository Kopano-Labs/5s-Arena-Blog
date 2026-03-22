import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Register is handled on the LoginPage via tabs — redirect there
export default function RegisterPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);
  return null;
}
