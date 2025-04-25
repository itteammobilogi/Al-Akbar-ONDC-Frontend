// import Footer from "@/components/Footer/Footer";
// import Navbar from "@/components/Navbar/Navbar";
// import { getUserProfile } from "@/utils/ApiUrlHelper";
// import { motion } from "framer-motion";
// import { Mail, MapPin, Calendar, Edit3 } from "lucide-react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const profile = await getUserProfile();
//         setUser(profile);
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//         router.push("/auth/Login");
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>My Profile | Al-Akbar</title>
//       </Head>

//       <Navbar />

//       <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-10 px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
//         >
//           {!user ? (
//             <p className="text-center text-gray-600">Loading profile...</p>
//           ) : (
//             <>
//               <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
//                 <button className="flex items-center gap-1 text-pink-600 hover:underline text-sm">
//                   <Edit3 className="w-4 h-4" />
//                   Edit Profile
//                 </button>
//               </div>

//               <div className="space-y-5">
//                 <div className="flex items-center gap-4">
//                   <div className="w-14 h-14 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
//                     {user.name?.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold text-gray-800">
//                       {user.name}
//                     </p>
//                     <p className="text-sm text-gray-500 flex items-center gap-1">
//                       <Mail className="w-4 h-4" /> {user.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* <div className="text-sm text-gray-700 space-y-3 mt-4">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4 text-gray-400" />
//                     <span>{user.location || "Not specified"}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     <span>
//                       Member since:{" "}
//                       {user.joined
//                         ? new Date(user.joined).toLocaleDateString()
//                         : "Unknown"}
//                     </span>
//                   </div>
//                 </div> */}
//               </div>
//             </>
//           )}
//         </motion.div>
//       </div>

//       <Footer />
//     </>
//   );
// }

import React from "react";

function index() {
  return <div>index</div>;
}

export default index;
