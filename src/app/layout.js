'use client';

import Link from "next/link";

import "./styles/css/globals.css";
import "./styles/css/form.css";
import "./styles/css/header.css";

import SessionWrapper from "@/components/SessionWrapper";
import { Header } from "@/components/header";


export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
        <SessionWrapper > 
          <Header />
          {children}
          <footer>Footer</footer>
        </SessionWrapper>
      </body>
    </html>
  );
}
