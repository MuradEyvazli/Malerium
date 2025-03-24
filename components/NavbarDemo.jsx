"use client";

import { Book, Sunset, Trees, Zap, Menu } from "lucide-react";
import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1"; // Update this path to where your Navbar1 component is located

// Demo data configuration
const navbarConfig = {
  logo: {
    url: "/",
    src: "/assets/maleriumBlack.png",
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

export function Navbar1Demo() {
  return <Navbar1 {...navbarConfig} />;
}