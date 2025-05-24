"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Login from "./_components/login";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-hidden">
      {/* Top-right navigation */}
      <div className="absolute top-4 right-6 flex items-center space-x-6 text-sm text-gray-300">
        <ClockDisplay />
        <a href="/event_page" className="hover:underline">
          Explore Events
        </a>
        <Login />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-between px-12 py-24 ml-40">
        {/* Left Text Content */}
        <div className="max-w-xl">
          <div className="text-lg font-medium">Eventra</div>
          <h1 className="text-5xl font-bold leading-tight mb-4"></h1>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Delightful events{" "}
            <span className="bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
              start here.
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Set up an event page, invite friends and sell tickets. Host a
            memorable event today.
          </p>
          <Button
            onClick={() => {
              if (session) {
                router.push("/create_page");
              } else {
                signIn("google", { callbackUrl: "/create_page" });
              }
            }}
            className="hover:cursor-pointer bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-300 transition shadow-lg"
          >
            Create Your First Event
          </Button>
        </div>

        {/* Right Image */}
        <div className="relative w-[500px] h-[600px] overflow-hidden right-40">
          <video
            src="/event_image.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full inset-y-0 left-0"
          />
        </div>
      </div>
    </div>
  );
};

function ClockDisplay() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      // Convert to GMT+8
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const gmt8 = new Date(utc + 8 * 3600000);
      setTime(
        gmt8.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " GMT+8"
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{time}</div>;
}

export default HomePage;
