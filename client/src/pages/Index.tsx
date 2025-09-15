import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This component acts as a redirect to the Dashboard
export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Dashboard...</p>
    </div>
  );
}