// /api/auth/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Hacker News Algolia API: "web development" konulu en yeni 5 haberi çekiyoruz.
    const hnUrl =
      "https://hn.algolia.com/api/v1/search_by_date?query=web+development&tags=story&hitsPerPage=5";
    const res = await fetch(hnUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Harici API'den veri alınamadı." },
        { status: 500 }
      );
    }

    const data = await res.json(); // data.hits: Array of news items
    // Front-end'in kolayca kullanabilmesi için veriyi "articles" altında döndürüyoruz.
    return NextResponse.json({ articles: data.hits }, { status: 200 });
  } catch (error) {
    console.error("Haber çekme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
