import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";

const BillingDrawer = ({ open, onClose }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] bg-[#0f1117]/70 border-1 border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex bg-linear-to-b from-sky-900/20 items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="text-white text-lg font-semibold">Billing</div>
                <div className="text-slate-400 text-sm">Plans & Credits</div>
              </div>
              <div>
                <button className="w-4 h-4 rounded-lg hover:bg-white/10 flex items-center justify-center">
                  <X onClick={onClose} size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-sky-900/[0.04] border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Current Plan</p>
                    <h3 className="text-[16px]">{userData?.plan || "free"}</h3>
                  </div>
                  <Crown className="text-yellow-400" />
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Credits</span>
                    <span>
                      {userData?.credits || 0}/{userData?.totalCredits || 100}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-br from-sky-600 transition-all duration-500"
                      style={{
                        width: `${((userData?.credits || 0) / (userData?.totalCredits || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-5">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Pro</h3>
                <p className="text-sky-600 text-xl font-bold mt-2">₹199</p>
                <p className="text-slate-400 text-sm mt-1">500 Credits</p>
                <button className="mt-4 w-full rounded-lg bg-sky-700 hover:bg-sky-800 py-2 text-white">
                  Upgrade
                </button>
              </div>
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Alpha</h3>
                <p className="text-sky-600 text-xl font-bold mt-2">₹499</p>
                <p className="text-slate-400 text-sm mt-1">1000 Credits</p>
                <button className="mt-4 w-full rounded-lg bg-sky-700 hover:bg-sky-800 py-2 text-white">
                  Upgrade
                </button>
              </div>
            </div>


          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
