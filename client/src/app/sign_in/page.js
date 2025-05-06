// app/signin.js
const SignInPage = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 rounded-lg p-10 shadow-lg max-w-md w-full">
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
    );
  };
  export default SignInPage;