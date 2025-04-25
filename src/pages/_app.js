// pages/_app.js or _app.tsx
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Component {...pageProps} />
    </>
  );
}
