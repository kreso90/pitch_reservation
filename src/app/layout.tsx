import SessionWrapper from "@/components/SessionWrapper";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={montserrat.className}>
        <main>
          <SessionWrapper>{children}</SessionWrapper>
        </main>
      </body>
    </html>
  );
}
