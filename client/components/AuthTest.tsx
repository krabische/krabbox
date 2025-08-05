import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function AuthTest() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleTestLogin = async () => {
    try {
      await login("test@example.com", "password123");
    } catch (error) {
      console.error("Test login failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Auth Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div><strong>Loading:</strong> {isLoading ? "Yes" : "No"}</div>
          <div><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</div>
          <div><strong>User:</strong> {user ? `${user.firstName} ${user.lastName}` : "None"}</div>
        </div>

        <div className="space-y-2">
          <Button onClick={handleTestLogin} className="w-full">
            Test Login
          </Button>
          <Button onClick={logout} variant="outline" className="w-full">
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