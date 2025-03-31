"use client";

import { useState, useEffect } from "react";
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

export function Navbar1Demo() {
  // Demo data configuration
  const navbarConfig = {
    logo: {
      url: "/",
      src: "/MaleriumTransparentWhite.png",
      alt: "blocks for shadcn/ui",
      // You can add title if you want it to display next to the logo
      // title: "malerium.com"
    },
    menu: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "Color Wheel",
        url: "/color-wheel",
        items: [
          {
            title: "Color Wheel",
            description: "Font collection for your next project",
            icon: <Menu className="w-5 h-5" />,
            url: "/color-wheel",
          },
          {
            title: "Color Search",
            description: "Our mission is to innovate and empower the world",
            icon: <Trees className="w-5 h-5" />,
            url: "/color-wheel/color-search",
          },
        ],
      },
      {
        title: "Products",
        url: "/products",
        items: [
          {
            title: "Fonts",
            description: "Font collection for your next project",
            icon: <Menu className="w-5 h-5" />,
            url: "/products/fonts",
          },
          {
            title: "Company",
            description: "Our mission is to innovate and empower the world",
            icon: <Trees className="w-5 h-5" />,
            url: "/products/company",
          },
        ],
      },
      {
        title: "Resources",
        url: "/resources",
        items: [
          {
            title: "Help Center",
            description: "Get all the answers you need right here",
            icon: <Zap className="w-5 h-5" />,
            url: "/resources/help-center",
          },
          {
            title: "Contact Us",
            description: "We are here to help you with any questions you have",
            icon: <Sunset className="w-5 h-5" />,
            url: "/resources/contact-us",
          },
          {
            title: "Terms of Service",
            description: "Our terms and conditions for using our services",
            icon: <Book className="w-5 h-5" />,
            url: "/resources/term-of-services",
          },
        ],
      },
      {
        title: "Blog",
        url: "/blog",
      },
    ],
    auth: {
      login: { text: "Log in", url: "/login" },
      signup: { text: "Sign up", url: "/signup" },
    },
  };

  return <Navbar1 {...navbarConfig} />;
}

export function Navbar1({
  logo = {
    url: "/",
    src: "/MaleriumTransparentWhite.png",
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
  
  // Add state for the mobile menu sheet
  const [sheetOpen, setSheetOpen] = useState(false);

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
        setSheetOpen(false); // Close the sheet after logout
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Helper: Create custom Link that closes the mobile menu on navigation
  const NavLink = ({ href, className, children, onClick }) => {
    return (
      <Link
        href={href}
        className={className}
        onClick={(e) => {
          setSheetOpen(false); // Close the sheet when any link is clicked
          if (onClick) onClick(e); // Call any additional onClick handlers
        }}
      >
        {children}
      </Link>
    );
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
                  <NavLink
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
                  </NavLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.title}>
        <NavLink 
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary focus:bg-gray-100 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50" 
          href={item.url}
        >
          {item.title}
        </NavLink>
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
                <NavLink
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
                </NavLink>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <NavLink
        key={item.title}
        className="py-2 font-medium block hover:text-primary"
        href={item.url}
      >
        {item.title}
      </NavLink>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* LOGO */}
            <Link href={logo.url} className="flex  items-center ">
              <img src={logo.src} alt={logo.alt} className="h-[140px] mb-1 w-auto" />
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
          <Link href={logo.url} className="flex  items-center">
            <img src={logo.src} alt={logo.alt} className="h-[150px] w-auto" />
          </Link>
          
          {/* Mobile Menu Button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <NavLink href={logo.url} className="flex items-center justify-start">
                    <img src={logo.src} alt={logo.alt} className="h-[150px] mb-[-50px] mt-[-50px] w-auto" />
                    {logo.title && <span className="ml-1 text-lg font-semibold">{logo.title}</span>}
                  </NavLink>
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
                        <NavLink
                          key={link.name}
                          href={link.url}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.name}
                        </NavLink>
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
                      <NavLink href={auth.login.url}>{auth.login.text}</NavLink>
                    </Button>
                    <Button asChild>
                      <NavLink href={auth.signup.url}>{auth.signup.text}</NavLink>
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