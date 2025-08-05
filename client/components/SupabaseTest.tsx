import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function SupabaseTest() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTestLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Test login result:', { data, error });
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Logout result:', { error });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div><strong>Loading:</strong> {loading ? "Yes" : "No"}</div>
          <div><strong>Session:</strong> {session ? "Yes" : "No"}</div>
          <div><strong>User:</strong> {user ? user.email : "None"}</div>
        </div>

        <div className="space-y-2">
          <Button onClick={handleTestLogin} className="w-full">
            Test Login
          </Button>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Check console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
} 