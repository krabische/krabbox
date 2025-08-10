import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Luggage, Menu, User, LogOut, Settings, Calendar } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { SupportModal } from "./SupportModal";
import { LanguageSelector } from "./LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const handleAuthClick = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
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
              {t('header.browseLuggage')}
            </Link>
            <Link
              to="/host"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('header.becomeHost')}
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('header.howItWorks')}
            </Link>
            <button
              onClick={() => setSupportModalOpen(true)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t('header.support')}
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            {isAuthenticated && user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/host">
                    <User className="h-4 w-4 mr-2" />
                    {t('header.host')}
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('header.account')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{t('header.myBookings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('header.settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('header.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthClick("login")}
                >
                  {t('header.login')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick("signup")}
                >
                  {t('header.signup')}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/host">
                    <User className="h-4 w-4 mr-2" />
                    {t('header.host')}
                  </Link>
                </Button>
              </>
            )}
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
              <div className="mb-4">
                <LanguageSelector />
              </div>
              <Link
                to="/browse"
                className="block text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.browseLuggage')}
              </Link>
              <Link
                to="/host"
                className="block text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.becomeHost')}
              </Link>
              <Link
                to="/how-it-works"
                className="block text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.howItWorks')}
              </Link>
              <button
                onClick={() => {
                  setSupportModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block text-sm font-medium transition-colors hover:text-primary text-left w-full"
              >
                {t('header.support')}
              </button>
              
              <div className="pt-4 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        {t('header.myAccount')}
                      </Link>
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('header.logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleAuthClick("login");
                        setIsMenuOpen(false);
                      }}
                    >
                      {t('header.login')}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        handleAuthClick("signup");
                        setIsMenuOpen(false);
                      }}
                    >
                      {t('header.signup')}
                    </Button>
                    <Button variant="secondary" className="w-full" asChild>
                      <Link to="/host" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        {t('header.becomeHost')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </>
  );
}
