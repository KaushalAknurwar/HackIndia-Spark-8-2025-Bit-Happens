import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from '@supabase/supabase-js';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        const { error } = await supabase.auth.getSession();
        if (error instanceof AuthError && error.message.includes("Invalid login credentials")) {
          toast({
            title: "Authentication Error",
            description: "You have not signed up yet. Please sign up first!",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md z-10">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            className="mr-4 text-white hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1 mr-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Moodventure
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Elevate Your Mood, Transform Your Life</p>
          </div>
        </div>
        
        {/* Auth form container with glassmorphism effect */}
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-300 hover:bg-white/15">
          {/* Gradient overlay for form background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none"></div>
          
          {/* Auth UI */}
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(168, 85, 247)', // Purple
                    brandAccent: 'rgb(192, 132, 252)', // Light purple
                    brandButtonText: 'white',
                    defaultButtonBackground: 'rgb(15, 23, 42)', // Dark slate
                    defaultButtonBackgroundHover: 'rgb(30, 41, 59)', // Darker slate
                    defaultButtonBorder: 'rgb(71, 85, 105)', // Slate border
                    defaultButtonText: 'white',
                    dividerBackground: 'rgb(71, 85, 105)', // Slate
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputBorder: 'rgb(71, 85, 105)',
                    inputBorderHover: 'rgb(168, 85, 247)',
                    inputBorderFocus: 'rgb(168, 85, 247)',
                    inputText: 'white',
                    inputLabelText: 'rgb(203, 213, 225)', // Light slate
                    inputPlaceholder: 'rgb(148, 163, 184)', // Slate
                  },
                  space: {
                    inputPadding: '1rem',
                    buttonPadding: '1rem',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                  fonts: {
                    bodyFontFamily: `'Inter', sans-serif`,
                    buttonFontFamily: `'Inter', sans-serif`,
                    inputFontFamily: `'Inter', sans-serif`,
                    labelFontFamily: `'Inter', sans-serif`,
                  },
                },
              },
              className: {
                container: 'w-full space-y-4',
                button: 'w-full px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                input: 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-purple-500 transition-all duration-200',
                label: 'text-sm font-medium text-gray-300 mb-1',
                message: 'text-red-400 text-sm mt-2',
                anchor: 'text-purple-400 hover:text-purple-300 transition-colors',
              },
            }}
            providers={["google"]}
            redirectTo="https://lovable.dev/projects/30918e7d-7794-40af-9d31-804d575a647f/dashboard"
            view="sign_in"
          />
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-8 h-8">
            <Loader />
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;