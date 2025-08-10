import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function SupabaseTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Test 1: Check if we can connect to Supabase
      const { data: session } = await supabase.auth.getSession();
      console.log('Session test:', session);
      
      // Test 2: Check if profiles table exists
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      console.log('Profiles test:', { profiles, error: profilesError });
      
      // Test 3: Check if listings table exists
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .limit(5);
      
      console.log('Listings test:', { listings, error: listingsError });

      // Test 4: Check auth.users table (this should work)
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('*')
        .limit(5);
      
      console.log('Auth users test:', { authUsers, error: authError });

      setTestResults({
        session: session ? 'Connected' : 'No session',
        profiles: profilesError ? `Error: ${profilesError.message}` : `Found ${profiles?.length || 0} profiles`,
        listings: listingsError ? `Error: ${listingsError.message}` : `Found ${listings?.length || 0} listings`,
        authUsers: authError ? `Error: ${authError.message}` : `Found ${authUsers?.length || 0} auth users`
      });

    } catch (error) {
      console.error('Connection test error:', error);
      setTestResults({
        error: `Connection failed: ${error}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestProfile = async () => {
    setIsLoading(true);
    try {
      // Create a test profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: 'test-user-' + Date.now(),
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            created_at: new Date().toISOString(),
            is_host: false
          }
        ])
        .select();

      if (error) {
        console.error('Create profile error:', error);
        setTestResults(prev => ({
          ...prev,
          createProfile: `Error: ${error.message}`
        }));
      } else {
        console.log('Created test profile:', data);
        setTestResults(prev => ({
          ...prev,
          createProfile: `Success: Created profile with ID ${data[0]?.id}`
        }));
      }
    } catch (error) {
      console.error('Create profile error:', error);
      setTestResults(prev => ({
        ...prev,
        createProfile: `Error: ${error}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const createTestListing = async () => {
    setIsLoading(true);
    try {
      // Create a test listing
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            host_id: 'test-user-' + Date.now(),
            host_name: 'Test Host',
            title: 'Test Listing',
            description: 'This is a test listing',
            category: 'carry-on',
            type: 'hardside',
            size: { height: 56, width: 35, depth: 23, unit: 'cm' },
            location: { address: '123 Test St', city: 'Test City', state: 'TS', zipCode: '12345' },
            pricing: { dailyRate: 10, securityDeposit: 50, isForSale: false, isForRent: true },
            features: ['TSA Lock', '4 Wheels'],
            condition: 'excellent',
            is_available: true,
            rating: 0,
            review_count: 0
          }
        ])
        .select();

      if (error) {
        console.error('Create listing error:', error);
        setTestResults(prev => ({
          ...prev,
          createListing: `Error: ${error.message}`
        }));
      } else {
        console.log('Created test listing:', data);
        setTestResults(prev => ({
          ...prev,
          createListing: `Success: Created listing with ID ${data[0]?.id}`
        }));
      }
    } catch (error) {
      console.error('Create listing error:', error);
      setTestResults(prev => ({
        ...prev,
        createListing: `Error: ${error}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button onClick={createTestProfile} disabled={isLoading} variant="outline">
            Create Test Profile
          </Button>
          <Button onClick={createTestListing} disabled={isLoading} variant="outline">
            Create Test Listing
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Badge variant={value?.toString().includes('Error') ? 'destructive' : 'default'}>
                  {key}
                </Badge>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 