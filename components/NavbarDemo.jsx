import { Book, Sunset, Trees, Zap, Menu } from "lucide-react";

import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1"

const demoData = {
  logo: {
    url: "/",
    src: "/assets/maleriumBlack.png",
    alt: "blocks for shadcn/ui",
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
          icon: <Menu className="size-5 shrink-0" />,
          url: "/color-wheel",
        },
        {
          title: "Color Search",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
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
          icon: <Menu className="size-5 shrink-0" />,
          url: "/products/fonts",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/products/company",
        },
      ],
    },
    
    {
      title: "Resources",
      url: "/",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/resources/help-center",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/resources/contact-us",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "/resources/term-of-services",
        },
      ],
    },
    {
      title: "Blog",
      url: "/blog",
    },
  ],
  mobileExtraLinks: [
    { name: "Press", url: "/press" },
    { name: "Contact", url: "/contact" },
    { name: "Imprint", url: "/imprint" },
    { name: "Sitemap", url: "/sitemap" },
  ],
  auth: {
    login: { text: "Log in", url: "/login" },
    signup: { text: "Sign up", url: "/signup" },
  },
};

function Navbar1Demo() {
  return <Navbar1 {...demoData} />;
}

export { Navbar1Demo };
