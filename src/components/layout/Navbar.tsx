"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calculator,
  BarChart3,
  Newspaper,
  Menu,
  X,
  TrendingUp,
  LineChart,
  BookAIcon,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/backend/providers/AuthProvider";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { signOut, user } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center mr-4">
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-finance-teal" />
            <span className="hidden font-bold sm:inline-block text-xl">
              Aasaan Retirement
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/investments"
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Investments</span>
            </Link>
            {/* <Link
              href="/stock-market"
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <LineChart className="h-4 w-4" />
              <span>Stock Market</span>
            </Link> */}
            <Link
              href="/news"
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
            >
              <Newspaper className="h-4 w-4" />
              <span>News</span>
            </Link>
            {user ? (
              <Link
                href="/create-article"
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <BookAIcon className="h-4 w-4" />
                <span> Create Article</span>
              </Link>
            ) : (
              <></>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Button size="sm">Get Started</Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleSignout}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container space-y-4">
            <Link
              href="/investments"
              className="flex items-center space-x-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Investments</span>
            </Link>
            <Link
              href="/stock-market"
              className="flex items-center space-x-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LineChart className="h-5 w-5" />
              <span>Stock Market</span>
            </Link>
            <Link
              href="/news"
              className="flex items-center space-x-2 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Newspaper className="h-5 w-5" />
              <span>News</span>
            </Link>
            {user ? (
              <Link
                href="/create-article"
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <BookAIcon className="h-4 w-4" />
                <span> Create Article</span>
              </Link>
            ) : (
              <></>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {!user ? (
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    className="w-full justify-start"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </Button>
                </>
              )}
              <Button className="w-full justify-start">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
