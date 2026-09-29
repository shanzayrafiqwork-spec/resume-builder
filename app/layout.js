import "./globals.css";

export const metadata = {
  title: "Resume Builder",
  description: "Simple Resume Builder App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}