// /api/search/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const page = searchParams.get("page") || 1; // sayfalama desteği
    if (!q || q.trim() === "") {
      return NextResponse.json(
        { error: "Arama terimi eksik!" },
        { status: 400 }
      );
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: "UNSPLASH_ACCESS_KEY bulunamadı!" },
        { status: 500 }
      );
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      q
    )}&page=${page}&client_id=${accessKey}&per_page=20`;

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Görsel servisine ulaşırken hata oluştu" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const results =
      data?.results?.map((item) => ({
        id: item.id,
        alt_description: item.alt_description,
        small: item.urls.small,
        full: item.urls.full,
        user: item.user?.name || "Anonymous",
      })) ?? [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Search handler error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
