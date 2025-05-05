import { useEffect } from "react";
import toast from "react-hot-toast";

export default function RewardBanner() {
  useEffect(() => {
    const interval = setInterval(() => {
      toast("🎉 Reminder: Buy 2 or more products and get ₹100 OFF!", {
        icon: "🎁",
        duration: 3000,
        position: "top-center",
        style: {
          background: "#ffe4e6",
          color: "#be123c",
          fontWeight: "bold",
          fontSize: "14px",
        },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    // <div className="bg-pink-200 text-pink-800 py-4 px-6 rounded-md shadow-md flex justify-center items-center text-center font-semibold text-lg my-4 animate-pulse">
    //   🎉 Buy 2 or more products and get ₹100 OFF! 🎉
    // </div>'
    <></>
  );
}
