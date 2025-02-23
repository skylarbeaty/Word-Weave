"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <div className="p-2">
      <nav className={`flex justify-between items-center mt-4 bg-indigo-300 text-black w-full max-w-[700px] rounded-lg justify-self-center
      p-[7px]   xs-box:p-[8px]    sm-box:p-[9px]    md-box:p-[10px]`}>
        <Link href="/" className={`text-xl font-bold 
          size-6   xs-box:size-7    sm-box:size-8    md-box:size-8`}>
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
              <Link href="/profile" className="size-6   xs-box:size-7    sm-box:size-8    md-box:size-8">
                  <img
                      src="/profile.svg"
                      alt="return"
                  />
              </Link>
              <button
                onClick={() => signOut()}
                className="size-6   xs-box:size-7    sm-box:size-8    md-box:size-8"
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
                  className="size-6   xs-box:size-7    sm-box:size-8    md-box:size-8"
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
    </div>
  )
}