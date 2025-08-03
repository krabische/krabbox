import { useState } from 'react';
import { Button } from './ui/button';
import { useListings } from '@/contexts/ListingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function TestListing() {
  const { user } = useAuth();
  const { addListing, isLoading } = useListings();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createTestListing = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await addListing({
        hostId: user.id,
        hostName: `${user.firstName} ${user.lastName}`,
        title: "Test Storage Space",
        description: "This is a test listing to verify the system works correctly.",
        images: ["/placeholder.svg"],
        category: "garage",
        type: "hardside",
        size: {
          height: 300,
          width: 500,
          depth: 400,
          unit: "cm"
        },
        features: ["24/7 Access", "Security Camera", "Climate Controlled"],
        condition: "excellent",
        location: {
          address: "123 Test Street",
          city: "Test City",
          state: "TS",
          zipCode: "12345"
        },
        availability: {
          available: true,
          minRentalDays: 1,
          maxRentalDays: 30
        },
        pricing: {
          dailyRate: 25,
          weeklyRate: 150,
          monthlyRate: 500,
          securityDeposit: 200,
          isForSale: false,
          isForRent: true
        }
      });

      toast({
        title: "Success!",
        description: "Test listing created successfully.",
      });
    } catch (error) {
      console.error('Error creating test listing:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create test listing.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Test Listing Creation</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          User: {user ? `${user.firstName} ${user.lastName}` : 'Not logged in'}
        </p>
        <p className="text-sm text-gray-600">
          Loading state: {isLoading ? 'Loading listings...' : 'Ready'}
        </p>
        <Button 
          onClick={createTestListing} 
          disabled={!user || isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating...' : 'Create Test Listing'}
        </Button>
      </div>
    </div>
  );
} 