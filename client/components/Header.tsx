import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Luggage, Menu, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Luggage className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">LugSpace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/browse"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Browse Luggage
          </Link>
          <Link
            to="/host"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Become a Host
          </Link>
          <Link
            to="/how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            How it Works
          </Link>
          <Link
            to="/support"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Support
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm">Sign up</Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Host
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link
              to="/browse"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Luggage
            </Link>
            <Link
              to="/host"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Host
            </Link>
            <Link
              to="/how-it-works"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              to="/support"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
              <Button className="w-full">Sign up</Button>
              <Button variant="secondary" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Become a Host
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
