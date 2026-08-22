import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata = {
    title: "BorrowBox — Share What You Have, Borrow What You Need",
    description: "A student item borrowing platform for campus communities. List what you're not using, borrow what you need.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark h-full antialiased">
            <body className="min-h-full flex flex-col">

                {/* PNG Background */}
                <div
                    className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/background.png')" }}
                />

                {/* Dark overlay —  */}
                <div className="fixed inset-0 -z-10 bg-black/50" />

                {children}

                <Toaster position="bottom-right" toastOptions={{
                    style: {
                        background: "rgba(16,17,24,0.9)",
                        color: "var(--color-text-hi)",
                        border: "1px solid var(--color-border-hi)",
                        backdropFilter: "blur(24px)",
                        fontFamily: "var(--font-body)",
                    },
                }} />

                <Script src="/devtools-guard.js" strategy="afterInteractive" />
            </body>
        </html>
    );
}