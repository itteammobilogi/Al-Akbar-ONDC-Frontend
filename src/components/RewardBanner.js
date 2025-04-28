import { useEffect } from "react";
import toast from "react-hot-toast";

export default function RewardBanner() {
  useEffect(() => {
    const interval = setInterval(() => {
      toast("🎉 Reminder: Buy 2 or more products and get ₹100 OFF!", {
        icon: "🎁",
        duration: 3000,
        position: "top-center", // ✅ Toast box in center
        style: {
          background: "#ffe4e6", // Light pink
          color: "#be123c", // Dark pink text
          fontWeight: "bold",
          fontSize: "14px",
        },
      });
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    // <div className="bg-pink-200 text-pink-800 py-4 px-6 rounded-md shadow-md flex justify-center items-center text-center font-semibold text-lg my-4 animate-pulse">
    //   🎉 Buy 2 or more products and get ₹100 OFF! 🎉
    // </div>'
    <></>
  );
}
