import { useState } from "react";
import { useLocation } from "wouter";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login redirect since the UI is dummy
    setLocation("/home");
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-black">
      {/* Background with Netflix-style fade */}
      <div 
        className="absolute inset-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/150c4b42-11f6-4576-a00f-c631308b1e43/web/US-en-20231218-POP_SIGNUP_TWO_WEEKS-perspective_WEB_aef7feeb-e2d4-4f3b-afe4-d92ece0ac1ad_small.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60 sm:bg-transparent sm:bg-gradient-to-b sm:from-black/80 sm:via-black/40 sm:to-black/80" />
      
      {/* Auth Box */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        <div className="bg-black/80 sm:bg-black/70 sm:backdrop-blur-md rounded-md p-8 sm:p-16 mb-24 w-full">
          <h2 className="text-3xl font-bold text-white mb-8">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleAuth}>
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-[#333] text-white px-4 py-3 rounded text-base focus:bg-[#444] focus:outline-none transition-colors"
                required
              />
            )}
            <input 
              type="email" 
              placeholder="Email or phone number" 
              className="w-full bg-[#333] text-white px-4 py-3 rounded text-base focus:bg-[#444] focus:outline-none transition-colors"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-[#333] text-white px-4 py-3 rounded text-base focus:bg-[#444] focus:outline-none transition-colors"
              required
            />
            
            <button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 mt-4 rounded transition-colors"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
            
            <div className="flex justify-between items-center text-sm text-[#b3b3b3] mt-2">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input type="checkbox" className="w-4 h-4 accent-red-600 rounded border-gray-600 bg-gray-700" />
                Remember me
              </label>
              <a href="#" className="hover:underline">Need help?</a>
            </div>
          </form>
          
          <div className="mt-16 text-[#b3b3b3]">
            {isLogin ? "New to Netflix? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-white hover:underline font-medium"
            >
              {isLogin ? "Sign up now." : "Sign in now."}
            </button>
          </div>
          
          <div className="mt-4 text-xs text-[#8c8c8c]">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. 
            <a href="#" className="text-blue-500 hover:underline ml-1">Learn more.</a>
          </div>
        </div>
      </div>
    </div>
  );
}
