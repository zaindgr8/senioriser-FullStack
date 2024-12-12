import React from "react";
import Header from "../components/Header";
import FooterWhite from "../components/footer-white";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <FooterWhite />
    </>
  );
}
