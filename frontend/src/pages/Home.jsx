import React from "react";
import { auth, googleProvider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import api from "../../utils/axios";

import { FcGoogle } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });

      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
  };

  return (
    <div className="h-screen flex bg-[#090a0f] text-white overflow-hidden">

      <SideBar/>
      <ChatArea/>
      <Artifact/>

      {!userData && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur">
          <div className="w-340px bg-[#161520] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
            <div>
              <h2 className="text-[17px] font-semibold text-center text-slate-100 tracking-tight">
                Welcome to Intesa 
              </h2>
              <p className="text-[13px] mt-2 text-slate-400">
                Please login with google to continue
              </p>
            </div>

            <button
              className="w-full flex items-center justify-center gap-3 py-2.75 rounded-xl text-sm font-medium text-white/80 bg-linear-to-br from-cyan-300 to-gray-900 hover:from-cyan-400 hover:to-gray-900 active:from-gray-500 active:to-gray-900 border border-gray-800/40 shadow-lg shadow-white/10 hover:shadow-gray-400/10 transition-all duration-150 cursor-pointer"
              onClick={googleLogin}
            >
              <FcGoogle size={25} className="text-white" />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
