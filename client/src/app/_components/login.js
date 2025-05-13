"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </>
  );
}
