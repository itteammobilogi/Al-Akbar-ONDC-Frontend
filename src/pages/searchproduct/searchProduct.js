import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSearchProduct } from "@/utils/ApiUrlHelper";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";

const SearchProduct = () => {
  const router = useRouter();
  const searchQuery = router.query.search || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        const data = await getSearchProduct(searchQuery);
        setProducts(data);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#fdf4f0]  min-h-screen px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-3xl font-extrabold text-center text-pink-700 mb-10 tracking-tight"
          >
            Search Results for:{" "}
            <span className="text-pink-500">{searchQuery}</span>
          </motion.h2>

          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 mt-20"
            >
              <img
                src="/no-results.svg"
                alt="No results"
                className="mx-auto w-40 mb-6"
              />
              <p className="text-lg">No products found for this search.</p>
              <a
                href="/"
                className="mt-4 inline-block text-pink-600 font-medium hover:underline"
              >
                Go back to homepage →
              </a>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              {products.map((product, index) => {
                let mainImage = "";
                try {
                  mainImage = JSON.parse(product.images)?.[0] || "";
                } catch {}

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className="relative backdrop-blur-xl  border border-pink-100 hover:border-pink-300 rounded-2xl shadow-xl group overflow-hidden"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <motion.img
                        src={`http://localhost:5000${mainImage}`}
                        alt={product.name}
                        className="h-48 w-full object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:blur-[1px]"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="absolute inset-x-0 bottom-4 mx-auto w-32 py-1 bg-pink-600 text-white text-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        Quick View
                      </motion.button>
                      {/* Pulse ring glow */}
                      <span className="absolute top-3 left-3 w-3 h-3 rounded-full bg-pink-400 animate-ping opacity-60" />
                      <span className="absolute top-3 left-3 w-3 h-3 rounded-full bg-pink-600" />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-pink-600 font-bold mt-2 text-base">
                        ₹{product.price}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchProduct;
