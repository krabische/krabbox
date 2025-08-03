import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function AuthDebug() {
  const { user, isAuthenticated, isLoading, signUpMessage } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Loading:</span>
            <Badge variant={isLoading ? "default" : "secondary"}>
              {isLoading ? "Yes" : "No"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Authenticated:</span>
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        {user && (
          <div className="space-y-2">
            <h4 className="font-medium">User Data:</h4>
            <div className="text-sm space-y-1">
              <div><strong>ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
              <div><strong>Host:</strong> {user.isHost ? "Yes" : "No"}</div>
              <div><strong>Join Date:</strong> {user.joinDate}</div>
            </div>
          </div>
        )}

        {signUpMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">{signUpMessage}</p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Check browser console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
} 