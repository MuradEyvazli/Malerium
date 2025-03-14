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
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Products",
      url: "/products",
      items: [
        {
          title: "Blog",
          description: "Latest industry news",
          icon: <Book className="w-5 h-5" />,
          url: "/blog",
        },
        {
          title: "Company",
          description: "Our mission",
          icon: <Trees className="w-5 h-5" />,
          url: "/company",
        },
        {
          title: "Careers",
          description: "Job listings",
          icon: <Sunset className="w-5 h-5" />,
          url: "/careers",
        },
        {
          title: "Support",
          description: "Contact support",
          icon: <Zap className="w-5 h-5" />,
          url: "/support",
        },
      ],
    },
  ],
  auth = {
    login: { text: "Log in", url: "/login" },
    signup: { text: "Sign up", url: "/signup" },
  },
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Kullanıcı bilgisini çekme (Bearer Token)
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
          dispatch(setUser(data.currentUser)); // data = { currentUser: {...} }
        } else {
          // Hata durumları (401 vs.)
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

  // Logout işlemi
  const handleLogout = async () => {
    try {
      // Backend'de /api/auth/logout rotanız varsa:
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
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-80 p-3">
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex gap-4 p-3 rounded-md hover:bg-gray-100"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      <p className="text-sm text-gray-600">
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
        <Link className="px-4 py-2 hover:text-black" href={item.url}>
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
          <AccordionTrigger className="py-2 font-semibold">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                className="flex gap-4 p-3 hover:bg-gray-100"
                href={subItem.url}
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  <p className="text-sm text-gray-600">
                    {subItem.description}
                  </p>
                </div>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item.title}
        className="py-2 font-semibold block"
        href={item.url}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <section className="py-4">
      <div className="container">
        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* LOGO */}
            <Link href={logo.url} className="flex items-center justify-center gap-3">
              <img src={logo.src} alt={logo.alt} className="mb-3 ml-10 w-32" />
              <span className="text-lg font-semibold">{logo.title}</span>
            </Link>
            {/* MENU */}
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map(renderMenuItem)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* RIGHT SIDE - AUTH */}
          <div className="flex gap-2 ">
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
        <div className="lg:hidden flex justify-end mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Link href={logo.url} className="flex items-center gap-2">
                    <img src={logo.src} alt={logo.alt} className="w-44" />
                    <span className="text-lg font-semibold">{logo.title}</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="my-6 flex flex-col gap-6">
                <Accordion type="single" collapsible>
                  {menu.map(renderMobileMenuItem)}
                </Accordion>
              </div>

              {/* MOBILE AUTH BUTTONS */}
              <div className="mt-4 flex gap-2">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
