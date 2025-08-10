import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateListingForm } from "@/components/CreateListingForm";
import { AuthModal } from "@/components/AuthModal";
import { UserListings } from "@/components/UserListings";
import { useListings } from "@/contexts/ListingsContext";
import { useState } from "react";
import {
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Users,
  Star,
  Package,
  Calculator,
  Plus
} from "lucide-react";

export default function Host() {
  const { isAuthenticated, user } = useAuth();
  const { userListings } = useListings();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50">
          {/* Hero Section */}
          <section className="py-20">
            <div className="container">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Earn Money by Sharing Your Luggage
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Turn your unused luggage into a profitable asset. Join thousands of hosts earning extra income on LugSpace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-lg px-8 py-3 h-auto"
                  >
                    Start Hosting Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-3 h-auto"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Earnings Calculator
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">$500+</div>
                    <div className="text-sm text-muted-foreground">Average Monthly Earnings</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Average Occupancy Rate</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">15min</div>
                    <div className="text-sm text-muted-foreground">Average Response Time</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
                    <div className="text-sm text-muted-foreground">Average Host Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-white">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Become a LugSpace Host?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Earn Extra Income</h3>
                  <p className="text-muted-foreground">
                    Make money from luggage you already own. Our top hosts earn over $1,000 per month.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Fully Protected</h3>
                  <p className="text-muted-foreground">
                    All rentals are fully insured. We handle payments, disputes, and provide 24/7 support.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Set Your Schedule</h3>
                  <p className="text-muted-foreground">
                    Complete control over when your luggage is available. Block dates when you need it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-16 bg-gray-50">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How Hosting Works
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">List Your Luggage</h3>
                  <p className="text-muted-foreground">
                    Create listings with photos, descriptions, and pricing. It takes less than 10 minutes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Accept Bookings</h3>
                  <p className="text-muted-foreground">
                    Receive booking requests and approve renters. Set your own availability and rules.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Paid</h3>
                  <p className="text-muted-foreground">
                    Earn money automatically. Payments are processed securely and deposited to your account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-primary text-white">
            <div className="container text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join LugSpace today and turn your luggage into profit.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setAuthModalOpen(true)}
                className="text-lg px-8 py-3 h-auto"
              >
                Get Started Now
              </Button>
            </div>
          </section>
        </div>

        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          defaultTab="signup"
        />
      </>
    );
  }

  // Authenticated user view
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your listings and start earning from your luggage.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userListings.length}</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                Start hosting to earn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                No ratings yet
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!showListingForm ? (
          userListings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Create Your First Listing</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start earning money by listing your storage space for rent. It only takes a few minutes to create your first listing.
                </p>
                <Button
                  size="lg"
                  onClick={() => setShowListingForm(true)}
                  className="text-lg px-8 py-3 h-auto"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <UserListings />
          )
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Create New Listing</h2>
                <p className="text-muted-foreground">
                  Add your storage space details to start earning money.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowListingForm(false)}
              >
                Cancel
              </Button>
            </div>
            <CreateListingForm />
          </div>
        )}
      </div>
    </div>
  );
}
