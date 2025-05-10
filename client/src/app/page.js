// app/page.js
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "../components/ui/button";

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-hidden">
      {/* Top-right navigation */}
      <div className="absolute top-4 right-6 flex items-center space-x-6 text-sm text-gray-300">
        <div>4:14 PM GMT+8</div>
        <a href="#" className="hover:underline">Explore Events</a>
        <Link href="/sign_in">
        <button className="px-4 py-1.5 bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 transition">
          Sign In
        </button>
        </Link>
      </div>
      <Button variant="outline">Button</Button>

      {/* Main content */}
      <div className="flex items-center justify-between px-12 py-24">
        {/* Left Text Content */}
        <div className="max-w-xl">
          <div className="text-lg font-medium">Eventra</div>
          <h1 className="text-5xl font-bold leading-tight mb-4"></h1>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Delightful events{' '}
            <span className="bg-gradient-to-r from-blue-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
              start here.
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Set up an event page, invite friends and sell tickets. Host a memorable event today.
          </p>
          <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition shadow-lg">
            Create Your First Event
          </button>
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

export default HomePage;
