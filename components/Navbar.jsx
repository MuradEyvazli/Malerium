import NavBar from "@/components/ui/navbar"
import { SplashCursor } from "./ui/splash-cursor";

export const menus = [
  {
    id: 1,
    title: 'Home',
    url: '/',
    dropdown: false,
  },
  {
    id: 2,
    title: 'Products',
    url: '/products',
    dropdown: true,
    items: [
      {
        id: 21,
        title: 'Electronics',
        url: '/products/electronics',
      },
      {
        id: 22,
        title: 'Clothing',
        url: '/products/clothing',
      },
      {
        id: 23,
        title: 'Accessories',
        url: '/products/accessories',
      },
    ],
  },
  {
    id: 3,
    title: 'Services',
    url: '/services',
    dropdown: true,
    items: [
      {
        id: 31,
        title: 'Consulting',
        url: '/services/consulting',
      },
      {
        id: 32,
        title: 'Support',
        url: '/services/support',
      },
    ],
  },
  {
    id: 4,
    title: 'About Us',
    url: '/about',
    dropdown: false,
  },
  {
    id: 5,
    title: 'Contact',
    url: '/contact',
    dropdown: false,
  },
];

export default function Navbar() {
  return <div>
    <NavBar list={menus} />
  </div>
  
}
