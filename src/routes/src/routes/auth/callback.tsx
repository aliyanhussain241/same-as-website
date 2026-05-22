import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(error);
          navigate({ to: "/login" });
          return;
        }

        if (session) {
          navigate({ to: "/resume" });
        } else {
          navigate({ to: "/login" });
        }
      } catch (err) {
        console.error(err);
        navigate({ to: "/login" });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
