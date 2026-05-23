import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus("Login failed. Redirecting...");
          setTimeout(() => { window.location.href = "/login"; }, 2000);
          return;
        }
        if (data.session) {
          window.location.href = "/resume";
          return;
        }
        // Hash params se session lo
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
          window.location.href = "/resume";
        } else {
          setTimeout(() => { window.location.href = "/login"; }, 2000);
        }
      } catch (e) {
        window.location.href = "/login";
      }
    };
    handleCallback();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff7ed" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 48, height: 48, border: "4px solid #ea580c",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 1s linear infinite", margin: "0 auto 16px"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#4b5563", fontWeight: 500 }}>{status}</p>
      </div>
    </div>
  );
}
