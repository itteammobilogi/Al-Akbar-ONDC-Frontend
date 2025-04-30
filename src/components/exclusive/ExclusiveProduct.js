import { getExclusiveProducts } from "@/utils/ApiUrlHelper";
import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

function ExclusiveProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchExclusive = async () => {
      try {
        const result = await getExclusiveProducts();
        setProducts(result);
      } catch (error) {
        console.error("Error loading exclusive products", error);
      }
    };
    fetchExclusive();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Exclusive Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = Array.isArray(product.images)
            ? product.images
            : JSON.parse(product.images || "[]");
          const mainImage = images[0];

          return (
            <>
              <div key={product?.id}>
                <Link href={`/product/${product.id}`}>
                  <div className="bg-white  border border-pink-200 rounded-lg shadow-md p-4 transition-transform hover:scale-105 cursor-pointer">
                    <div className="relative">
                      {/* <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
                    Exclusive
                  </span> */}

                      {/* <Slider
                    dots={true}
                    arrows={false}
                    infinite
                    speed={300}
                    slidesToShow={1}
                    slidesToScroll={1}
                    autoplay
                    autoplaySpeed={3000}
                    className="product-slider"
                  >
                    {images.map((img, index) => (
                      <div className="rounded overflow-hidden border border-gray-200">
                        <img
                          src={`http://localhost:5000${img}`}
                          alt={`Product ${index}`}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    ))}
                  </Slider> */}
                      <div className="rounded overflow-hidden bg-white flex items-center justify-center h-52">
                        <img
                          src={`https://ondcapi.elloweb.com${mainImage}`}
                          alt={`Product ${product.name}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 text-sm mb-1 mt-3 truncate">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-2">
                      <p className="text-pink-600 font-bold text-sm">
                        ₹{product.discountPrice || product.price}
                      </p>
                      {product.discountPrice && (
                        <p className="text-gray-400 text-xs line-through">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ExclusiveProduct;
