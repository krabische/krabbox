import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useListings } from "@/contexts/ListingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navigate, Link } from "react-router-dom";
import { EditProfileModal } from "@/components/EditProfileModal";
import {
  User,
  Settings,
  Calendar,
  CreditCard,
  Star,
  MapPin,
  Clock,
  Package,
  TrendingUp,
  Shield,
  DollarSign,
} from "lucide-react";

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const { listings } = useListings();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Get user's listings
  const userListings = listings.filter((listing) => listing.hostId === user.id);

  // Mock earnings data
  const totalEarnings = userListings.length * 450; // Mock calculation
  const monthlyEarnings = [120, 380, 290, 450, 670, 820]; // Mock data for last 6 months

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const mockBookings = [
    {
      id: "1",
      luggage: "Premium Hardside Carry-On",
      location: "JFK Airport",
      dates: "Dec 15-20, 2024",
      status: "upcoming",
      price: 60,
    },
    {
      id: "2",
      luggage: "Travel Duffel Bag",
      location: "Times Square Hotel",
      dates: "Nov 10-15, 2024",
      status: "completed",
      price: 40,
    },
  ];

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 bg-white text-primary text-xl font-bold">
              <AvatarFallback>
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/80 mb-2">
                Member since {new Date(user.joinDate).getFullYear()}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9 rating</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {user.isHost ? "Host" : "Traveler"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Next Trip
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Dec 15</div>
                  <p className="text-xs text-muted-foreground">
                    JFK Airport pickup
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
              {mockBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{booking.luggage}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.dates}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${booking.price}</div>
                        <Badge
                          variant={
                            booking.status === "upcoming"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            {userListings.length > 0 ? (
              <>
                {/* Earnings Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Listings
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userListings.length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        All listings active
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Earnings
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${monthlyEarnings[monthlyEarnings.length - 1]}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +23% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Earned
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalEarnings}</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        Withdraw
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Earnings Graph */}
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {monthlyEarnings.map((amount, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-primary rounded-t-sm w-full"
                            style={{
                              height: `${(amount / Math.max(...monthlyEarnings)) * 200}px`,
                            }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">
                            {new Date(2024, index + 6).toLocaleDateString(
                              "en",
                              { month: "short" },
                            )}
                          </span>
                          <span className="text-xs font-medium">${amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* User's Listings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                      <Card key={listing.id}>
                        <div className="relative">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2"
                          >
                            ${listing.pricing.dailyRate}/day
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold line-clamp-1">
                            {listing.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {listing.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="outline" className="text-xs">
                              {listing.condition}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-xs">
                                {listing.rating > 0
                                  ? listing.rating.toFixed(1)
                                  : "New"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Listings Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start earning money by listing your storage space for rent.
                  </p>
                  <Button asChild>
                    <Link to="/host">Create Your First Listing</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <p className="text-muted-foreground">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <p className="text-muted-foreground">{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Mobile Number</label>
                  <p className="text-muted-foreground">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setEditProfileOpen(true)}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive booking confirmations and updates
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Payment Methods</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage your payment options
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <Button variant="destructive" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </div>
  );
}
