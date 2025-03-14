import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  // Gerekli parametreler
  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/api/auth/google/callback", 
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    prompt: "consent", // Tekrar tekrar izin istemesi için
    access_type: "offline", // refresh_token alabilmek için
  };

  // URL parametrelerini oluştur
  const qs = new URLSearchParams(options).toString();
  
  // Kullanıcıyı Google'ın OAuth ekranına yönlendir
  return NextResponse.redirect(`${rootUrl}?${qs}`);
}
