"use client";

import { useEffect } from "react";
import CSVUpload from "@/components/csv-upload"; // Corrected import


import AOS from "aos";
import "aos/dist/aos.css";

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <>
      <Header />

      <main className="grow"><CSVUpload />{children}</main>

      <Footer border={true} />
    </>
  );
}
