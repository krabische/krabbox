import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function SupabaseDebugTest() {
  const [status, setStatus] = useState("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const testConnection = async () => {
    setStatus("Testing Supabase connection...");
    setError(null);
    setResults([]);

    try {
      // Test 1: Basic connection
      console.log("Test 1: Basic Supabase connection");
      const { data: healthData, error: healthError } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true });

      if (healthError) {
        console.error("Health check error:", healthError);
        setError(`Connection Error: ${healthError.message}`);
        setStatus("Connection failed");

        // Check if it's a table not found error
        if (
          healthError.message.includes(
            'relation "public.listings" does not exist',
          )
        ) {
          setStatus(
            'Table "listings" does not exist - this is expected if database is not set up',
          );
        }
        return;
      }

      console.log("Health check successful");
      setStatus("Connection successful");

      // Test 2: Try to fetch data
      console.log("Test 2: Fetching data");
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .limit(5);

      if (error) {
        console.error("Data fetch error:", error);
        setError(`Data Error: ${error.message}`);
      } else {
        console.log("Data fetch successful:", data);
        setResults(data || []);
        setStatus(`Success: Found ${data?.length || 0} listings`);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(`Unexpected Error: ${err}`);
      setStatus("Test failed");
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <strong>Sample Data:</strong>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <Button onClick={testConnection} className="w-full">
          Test Again
        </Button>
      </CardContent>
    </Card>
  );
}
