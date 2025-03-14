// app/layout.jsx veya app/rootLayout.jsx
import "../app/globals.css";
import ClientProviders from "./providers/ClientProviders";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
