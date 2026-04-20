"use client";

import Link from "next/link";
import { ReactNode } from "react";
import "nes.css/css/nes.min.css";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="mb-6 flex flex-col items-center justify-center gap-4 md:flex-row">
        <Link href="/">
          <button className="btn-ghost">Neo Bestiary</button>
        </Link>
        <Link href="/bestiary">
          <button className="btn-ghost">Bestiary</button>
        </Link>
      </div>
      <div className="flex items-center justify-center max-w-[1250px] m-auto">{children}</div>
    </>
  );
};

export default Layout;
