import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function SupabaseConnectionTest() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    addResult("Testing basic connection...");
    
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        addResult(`❌ Database error: ${error.message}`);
        console.error('Database test error:', error);
      } else {
        addResult("✅ Database connection successful");
        console.log('Database test success:', data);
      }
    } catch (error) {
      addResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAuthConnection = async () => {
    setLoading(true);
    addResult("Testing auth connection...");
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult(`❌ Auth error: ${error.message}`);
        console.error('Auth test error:', error);
      } else {
        addResult("✅ Auth connection successful");
        addResult(`Session: ${data.session ? "Active" : "None"}`);
        console.log('Auth test success:', data);
      }
    } catch (error) {
      addResult(`❌ Auth network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Auth network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    addResult("Testing signup...");
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (error) {
        addResult(`❌ Signup error: ${error.message}`);
        console.error('Signup test error:', error);
      } else {
        addResult("✅ Signup request successful");
        addResult(`User created: ${data.user ? "Yes" : "No"}`);
        console.log('Signup test success:', data);
      }
    } catch (error) {
      addResult(`❌ Signup network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Signup network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testBasicConnection} disabled={loading} className="w-full">
            Test Database
          </Button>
          <Button onClick={testAuthConnection} disabled={loading} variant="outline" className="w-full">
            Test Auth
          </Button>
          <Button onClick={testSignUp} disabled={loading} variant="outline" className="w-full">
            Test Signup
          </Button>
          <Button onClick={clearResults} variant="ghost" className="w-full">
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 border rounded text-xs space-y-1">
            {results.map((result, index) => (
              <div key={index} className="whitespace-pre-wrap">{result}</div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Check console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
} 