// data.js

// Kategori Listesi
// Haber Data
export const newsData = [
  {
    id: 1,
    title: "React 18 Yayınlandı",
    description:
      "React 18 ile gelen otomatik batching, geçiş (transitions) ve gelişmiş Suspense...",
    link: "#",
    image:
      "https://images.pexels.com/photos/30303996/pexels-photo-30303996.jpeg",
  },
  {
    id: 2,
    title: "Tailwind CSS 3.3 Çıktı",
    description:
      "Daha esnek düzenler ve kapsamlı dark mode seçenekleriyle Tailwind CSS 3.3 sürümü...",
    link: "#",
    image:
      "https://images.pexels.com/photos/30406023/pexels-photo-30406023.jpeg",
  },
  {
    id: 3,
    title: "Next.js 13 Yenilikleri",
    description:
      "Yeni App Router, server components ve streaming SSR ile Next.js artık çok daha güçlü...",
    link: "#",
    image:
      "https://images.pexels.com/photos/29530548/pexels-photo-29530548.jpeg",
  },
];

export const categories = [
    "UI/UX Tasarım",
    "İllüstrasyon",
    "Grafik Tasarım",
    "3D Modelleme",
    "Animasyon",
    "Dijital Sanat",
    "Fotoğrafçılık",
    "İç Mekan Tasarımı",
    "Reklam Tasarımı",
    "Tipografi",
  ];
  
  // Popüler Etiketler
  export const popularTags = [
    "#MinimalDesign",
    "#UITrends",
    "#GraphicArt",
    "#Illustration",
    "#3DModeling",
  ];
  
  // Tasarımcı Kategorileri (Slider’da kullanılan)
  export const designerCategories = [
    {
      id: "svg",
      title: "SVG Bul",
      description: "Modern, vektörel tasarımlar ve ikonlar",
      route: "/blog/find-svg",
      image: "/assets/find-svg.png", // public/images/svg-poster.jpg
    },
    {
      id: "mockups",
      title: "Mockup'lar",
      description: "En güncel mockup'lar ve template'ler",
      route: "/blog/find-mockups",
      image: "/assets/find-mockups.png",
    },
    {
      id: "posters",
      title: "Modern Posterler",
      description: "Etkileyici poster tasarımları",
      route: "/blog/find-posters",
      image: "/assets/find-posters.png",
    },
    {
      id: "ui-kit",
      title: "UI Kit",
      description: "Kullanıcı arayüzü kitleri ve elementleri",
      route: "/blog/find-ui-kit",
      image: "/assets/find-ui.png",
    },
    {
      id: "illustrations",
      title: "İllüstrasyonlar",
      description: "Modern illüstrasyon örnekleri",
      route: "/blog/find-illustrations",
      image: "/assets/find-illustrations.png",
    },
    {
      id: "typography",
      title: "Tipografi",
      description: "Yaratıcı tipografi çalışmaları",
      route: "/blog/find-typography",
      image: "/assets/find-typography.png",
    },
    {
      id: "3d",
      title: "3D Render",
      description: "Gerçekçi 3D render ve modellemeler",
      route: "/blog/find-3d",
      image: "/assets/find-3drender.png",
    },
    {
      id: "animations",
      title: "Animasyon Çalışmaları",
      description: "Dinamik animasyon örnekleri",
      route: "/blog/find-animations",
      image: "/assets/find-animations.png",
    },
    {
      id: "logos",
      title: "Logo Tasarımları",
      description: "Özgün ve modern logo tasarımları",
      route: "/blog/find-logos",
      image: "/assets/find-logo.png",
    },
    {
      id: "ads",
      title: "Reklam Tasarımları",
      description: "Yaratıcı reklam ve kampanya görselleri",
      route: "/blog/find-ads",
      image: "/assets/find-advertising.png",
    },
  ];
  
  // Öne çıkan blog yazıları
  export const featuredBlogs = [
    {
      id: 101,
      title: "Renk Teorisi ve Minimalizm",
      image:
        "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      excerpt:
        "Tasarımda renklerin psikolojisini anlayarak minimal tasarımlara nasıl derinlik katabileceğinizi öğrenin.",
    },
    {
      id: 102,
      title: "İllüstrasyonlarda Yeni Trendler",
      image:
        "https://images.pexels.com/photos/434337/pexels-photo-434337.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
      excerpt:
        "Modern illüstrasyon trendlerine göz atın ve yaratıcılığınızı nasıl canlandırabileceğinizi keşfedin.",
    },
    {
      id: 103,
      title: "Animasyon ve UI/UX kurallari",
      image:
        "https://images.pexels.com/photos/31018631/pexels-photo-31018631.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      excerpt:
        "Neden bu konuda gercekci olmamiz gerekdigini yeniden kanitlamis olduk",
    },
  ];
  