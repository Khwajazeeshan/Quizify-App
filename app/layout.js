import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Quizify - Smart MCQ Test Preparation",
    template: "%s | Quizify"
  },
  description: "Ace your exams with Quizify's specialized technical assessments and interactive MCQ quizzes. Master JavaScript, React, HTML, Node.js and more.",
  keywords: ["quiz", "mcq", "test preparation", "javascript quiz", "react quiz", "technical assessment", "learning"],
  authors: [{ name: "Quizify Team" }],
  creator: "Quizify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quizify.app",
    siteName: "Quizify",
    title: "Quizify - Smart MCQ Test Preparation",
    description: "Interactive MCQ quizzes to help you master technical skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quizify - Smart MCQ Test Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizify - Smart MCQ Test Preparation",
    description: "Interactive MCQ quizzes to help you master technical skills.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
