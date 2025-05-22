// app/signin.js
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="relative min-h-screen bg-zinc-900 ">
      {/* Top-right navigation */}
      <div className="absolute top-4 right-6 flex items-center space-x-6 text-sm text-gray-300">
        <div>4:14 PM GMT+8</div>
        <a href="#" className="hover:underline">
          Explore Events
        </a>
        <Link
          href="/sign_in"
          className="px-4 py-1.5 bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 transition"
        >
          Sign In
        </Link>
      </div>

      {/* Centered sign-in form */}
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="bg-zinc-800/30 backdrop-blur-lg rounded-3xl p-10 shadow-lg max-w-md w-full border border-gray-500/20">
          <h2 className="text-2xl font-bold mb-6">Welcome to Eventra</h2>
          <p className="mb-4">Please sign in or sign up below.</p>

          <input
            type="email"
            placeholder="you@email.com"
            className="w-full mb-4 rounded-md bg-gray-700 p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
            Continue with Email
          </button>

          <p className="text-center my-4">or</p>

          <button className="w-full flex items-center justify-center bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
