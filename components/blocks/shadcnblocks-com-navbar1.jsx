"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/app/features/UserSlice";
import { Menu, Book, Sunset, Trees, Zap } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function Navbar1({
  logo = {
    url: "/",
    src: "/assets/maleriumBlack.png",
    alt: "logo",
    title: "malerium.com",
  },
  menu = [],
  mobileExtraLinks = [],
  auth = {
    login: { text: "Log in", url: "/login" },
    signup: { text: "Sign up", url: "/signup" },
  },
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Fetch user information (Bearer Token)
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(clearUser());
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data.currentUser));
        } else {
          // Handle errors (401 etc.)
          dispatch(clearUser());
          if (res.status === 401) {
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        dispatch(clearUser());
      }
    }
    fetchUser();
  }, [dispatch]);

  // Logout function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        dispatch(clearUser());
        localStorage.removeItem("token");
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Helper: Render Desktop Menu Item
  const renderMenuItem = (item) => {
    if (item.items) {
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger className="bg-transparent">{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-96 gap-2 p-4 md:w-[400px] md:grid-cols-2">
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex items-start gap-3 rounded-md p-3 hover:bg-gray-100"
                    href={subItem.url}
                  >
                    <div className="mt-1 text-primary">{subItem.icon}</div>
                    <div>
                      <div className="font-medium">{subItem.title}</div>
                      <p className="text-sm text-muted-foreground">
                        {subItem.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.title}>
        <Link 
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50" 
          href={item.url}
        >
          {item.title}
        </Link>
      </NavigationMenuItem>
    );
  };

  // Helper: Render Mobile Menu Item
  const renderMobileMenuItem = (item) => {
    if (item.items) {
      return (
        <AccordionItem key={item.title} value={item.title}>
          <AccordionTrigger className="py-2 font-medium">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {item.items.map((subItem) => (
                <Link
                  key={subItem.title}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
                  href={subItem.url}
                >
                  <div className="text-primary">{subItem.icon}</div>
                  <div>
                    <div className="font-medium">{subItem.title}</div>
                    <p className="text-sm text-muted-foreground">
                      {subItem.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item.title}
        className="py-2 font-medium block hover:text-primary"
        href={item.url}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* LOGO */}
            <Link href={logo.url} className="flex items-center mr-6">
              <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
              {logo.title && <span className="ml-2 text-lg font-semibold">{logo.title}</span>}
            </Link>
            
            {/* MENU */}
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map(renderMenuItem)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* RIGHT SIDE - AUTH */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.text}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.text}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* MOBILE NAV */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          {/* Mobile Logo */}
          <Link href={logo.url} className="flex items-center">
            <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
          </Link>
          
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <Link href={logo.url} className="flex items-center">
                    <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
                    {logo.title && <span className="ml-2 text-lg font-semibold">{logo.title}</span>}
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {menu.map(renderMobileMenuItem)}
                </Accordion>
                
                {/* Extra mobile links if provided */}
                {mobileExtraLinks.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {mobileExtraLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.url}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE AUTH BUTTONS */}
              <div className="mt-6 flex flex-col space-y-2">
                {currentUser ? (
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href={auth.login.url}>{auth.login.text}</Link>
                    </Button>
                    <Button asChild>
                      <Link href={auth.signup.url}>{auth.signup.text}</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}