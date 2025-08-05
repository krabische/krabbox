import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ConnectionTest() {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult("Testing connection...");
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setTestResult(`Connection error: ${error.message}`);
        console.error('Connection test error:', error);
      } else {
        setTestResult("Connection successful! Supabase is reachable.");
        console.log('Connection test success:', data);
      }
    } catch (error) {
      setTestResult(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAuthConnection = async () => {
    setLoading(true);
    setTestResult("Testing auth connection...");
    
    try {
      // Test auth connection by trying to get session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult(`Auth error: ${error.message}`);
        console.error('Auth test error:', error);
      } else {
        setTestResult("Auth connection successful! Session: " + (data.session ? "Active" : "None"));
        console.log('Auth test success:', data);
      }
    } catch (error) {
      setTestResult(`Auth network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Auth network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testConnection} disabled={loading} className="w-full">
            Test Database Connection
          </Button>
          <Button onClick={testAuthConnection} disabled={loading} variant="outline" className="w-full">
            Test Auth Connection
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-50 border rounded text-sm">
            {testResult}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Check console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
} 