import React from "react";
import { auth, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";

const App = () => {
  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button
        className="w-50 h-24 bg-white cursor-pointer"
        onClick={googleLogin}
      >
        continue with google
      </button>
    </div>
  );
};

export default App;
