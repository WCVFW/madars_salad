
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, LogOut, Settings, Utensils, Menu } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isProductsPage = location.pathname === '/products';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({ title: "Signed out successfully" });
      navigate("/");
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error?.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const NavigationItems = () => (
    <>
      <Link 
        to="/subscriptions" 
        className="text-gray-700 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Utensils className="h-4 w-4" />
        Browse Plans
      </Link>
      <Link 
        to="/products" 
        className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        Products
      </Link>
    </>
  );

  return (
    <header 
      className={`shadow-sm border-b sticky top-0 z-50 bg-card transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      onMouseEnter={() => setIsVisible(true)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-24 relative">
          {/* Hamburger Menu (Products Page Only) - Top Left */}
          {isProductsPage && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                // Dispatch custom event to trigger sidebar on products page
                window.dispatchEvent(new CustomEvent('openProductsSidebar'));
              }}
              className="absolute left-0 bg-card shadow-md border-green-600 text-green-600 hover:bg-green-50 z-10"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Logo - Center */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="/lovable-uploads/f141f057-f674-4b5a-8778-666475e154d3.png" 
                alt="Madras Salad Logo" 
                className="h-20 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center space-x-8 absolute right-0">
            <nav className="flex items-center space-x-6">
              <NavigationItems />
            </nav>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4 border-l pl-6">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile?tab=subscription" className="flex items-center">
                        <Utensils className="mr-2 h-4 w-4" />
                        My Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {loading ? 'Signing out...' : 'Sign Out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6"
                  >
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <nav className="flex flex-col space-y-4">
                    <NavigationItems />
                  </nav>
                  
                  <div className="border-t pt-6">
                    {user ? (
                      <div className="space-y-4">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </Link>
                        <Link 
                          to="/profile?tab=subscription" 
                          className="flex items-center gap-3 text-gray-700 hover:text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Utensils className="h-4 w-4" />
                          My Subscription
                        </Link>
                        <Button 
                          variant="ghost" 
                          onClick={handleSignOut} 
                          disabled={loading}
                          className="justify-start p-0 h-auto text-gray-700 hover:text-orange-600"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {loading ? 'Signing out...' : 'Sign Out'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button 
                          asChild
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        >
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
