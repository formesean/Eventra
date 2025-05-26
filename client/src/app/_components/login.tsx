"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-1 text-sm bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 transition hover:cursor-pointer"
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => signIn("google", { callbackUrl: "/event" })}
        className="px-4 py-1 text-sm bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 transition hover:cursor-pointer"
      >
        Sign In
      </button>
    </>
  );
}
