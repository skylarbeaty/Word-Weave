"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className={`flex justify-between items-center mt-4 bg-indigo-300 text-black w-full max-w-[700px] rounded-lg justify-self-center
    p-[8px]   xs-box:p-[10px]    sm-box:p-[12px]    md-box:p-[16px]`}>
      <Link href="/" className={`text-xl font-bold 
        size-6   xs-box:size-8    sm-box:size-9    md-box:size-10`}>
        <img
            src="/home.svg"
            alt="return"
        />
      </Link>

      <div>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <div className="flex items-center gap-2">
            <Link href="/profile" className="size-6   xs-box:size-8    sm-box:size-9    md-box:size-10">
                <img
                    src="/profile.svg"
                    alt="return"
                />
            </Link>
            <button
              onClick={() => signOut()}
              className="size-6   xs-box:size-8    sm-box:size-9    md-box:size-10"
            >
                <img
                    src="/logout.svg"
                    alt="return"
                />
            </button>
          </div>
        ) : (
          <div className="flex">
            <button
                onClick={() => signIn()}
                className="size-6   xs-box:size-8    sm-box:size-9    md-box:size-10"
            >
                <img
                    src="/login.svg"
                    alt="return"
                />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}