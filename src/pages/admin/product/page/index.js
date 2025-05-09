// import React, { useEffect, useState } from "react";
// import {
//   createProduct,
//   deleteProductById,
//   editProductById,
//   getAllProducts,
// } from "@/utils/ApiUrlHelper";
// import AdminLayout from "@/components/Sidebar/Sidebar";
// import { Edit3, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// const ProductPage = () => {
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editProduct, setEditProduct] = useState(null);
//   const [editModal, setEditModal] = useState(false);
//   const itemsPerPage = 5;

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(products.length / itemsPerPage);

//   useEffect(() => {
//     const loadProducts = async () => {
//       const data = await getAllProducts();
//       if (data) {
//         // Assuming data is an array, not an object containing 'products'
//         setProducts(data || []);
//       }
//     };
//     loadProducts();
//   }, []);

//   // Stub functions for handling edit and delete actions
//   const handleEdit = (id) => {
//     if (!window.confirm("Are you sure you want to edit this product?")) return;

//     const product = products.find((p) => p.id === id);

//     const safeParse = (value, fallback = []) => {
//       try {
//         return JSON.parse(value);
//       } catch {
//         return fallback;
//       }
//     };

//     setEditProduct({
//       ...product,
//       sizes: safeParse(product.sizes),
//       colors: safeParse(product.colors),
//       images: safeParse(product.images),
//       categoryId: Array.isArray(product.categoryId)
//         ? product.categoryId
//         : safeParse(product.categoryId, []),
//       variants: safeParse(product.variants),
//     });

//     setEditModal(true);
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this product?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await deleteProductById(id);
//       console.log("Delete Response :", res);
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       toast.success(res.message || "Product deleted");
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Error deleting product");
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const formData = new FormData(e.target);

//   //   try {
//   //     if (editProduct && editProduct.id) {
//   //       // 🛠 Edit flow
//   //       await editProductById(editProduct.id, formData);
//   //       toast.success("Product updated successfully");
//   //     } else {
//   //       // ➕ Add flow (implement this API if not yet created)
//   //       await createProduct(formData);
//   //       toast.success("Product added successfully");
//   //     }

//   //     // Close modal and refresh
//   //     setEditModal(false);
//   //     setEditProduct(null);
//   //     const updated = await getAllProducts();
//   //     setProducts(updated);
//   //   } catch (err) {
//   //     console.error("Form submit failed:", err);
//   //     toast.error("Operation failed");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);

//     // Extract variants from DOM
//     const variants = [];
//     for (let i = 0; i < (editProduct?.variants?.length || 0); i++) {
//       const color = form[`variant_color_${i}`]?.value;
//       const stock = form[`variant_stock_${i}`]?.value;
//       const image = form[`variant_image_${i}`]?.files?.[0];

//       if (color && stock) {
//         const variant = { color, stock };
//         if (image) {
//           variant.image = image;
//         }
//         variants.push(variant);
//       }
//     }

//     formData.append("variants", JSON.stringify(variants));

//     try {
//       if (editProduct && editProduct.id) {
//         await editProductById(editProduct.id, formData);
//         toast.success("Product updated successfully");
//       } else {
//         await createProduct(formData);
//         toast.success("Product added successfully");
//       }

//       setEditModal(false);
//       setEditProduct(null);
//       const updated = await getAllProducts();
//       setProducts(updated);
//     } catch (err) {
//       console.error("Form submit failed:", err);
//       toast.error("Operation failed");
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black  text-white rounded-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-3xl font-extrabold text-teal-400">
//             All Products
//           </h2>
//           <button
//             className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white font-semibold px-5 py-2 rounded shadow-lg hover:scale-105 transition-all"
//             onClick={() => {
//               setEditProduct(null); // reset product
//               setEditModal(true); // open modal
//             }}
//           >
//             Add Product
//           </button>
//         </div>

//         {currentProducts.length === 0 ? (
//           <p className="text-gray-400 italic">No products found.</p>
//         ) : (
//           <div className="overflow-x-auto border border-gray-700 rounded-xl shadow-xl">
//             <table className="min-w-full text-sm text-white">
//               <thead className="bg-teal-700 uppercase tracking-wider">
//                 <tr>
//                   <th className="px-4 py-3 text-left">ID</th>
//                   <th className="px-4 py-3 text-left">Name</th>
//                   <th className="px-4 py-3 text-left">Image</th>
//                   <th className="px-4 py-3 text-left">Price</th>
//                   <th className="px-4 py-3 text-left">Discount</th>
//                   <th className="px-4 py-3 text-left">Stock</th>
//                   <th className="px-4 py-3 text-left">Category</th>
//                   <th className="px-4 py-3 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {currentProducts.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="hover:bg-teal-800/40 transition"
//                   >
//                     <td className="px-4 py-2">{product.id}</td>
//                     <td className="px-4 py-2">{product.name}</td>
//                     <td className="px-4 py-2">
//                       {(() => {
//                         const images = Array.isArray(product.images)
//                           ? product.images
//                           : JSON.parse(product.images || "[]");
//                         const mainImage = images[0];

//                         if (mainImage) {
//                           const cleanPath = mainImage.startsWith("/uploads")
//                             ? mainImage.replace("/uploads", "")
//                             : mainImage;

//                           return (
//                             <img
//                               src={`http://ondcapi.elloweb.com/uploads/${cleanPath}`}
//                               alt={product.name}
//                               className="w-12 h-12 object-cover rounded shadow-md"
//                             />
//                           );
//                         } else {
//                           return (
//                             <span className="text-gray-500 text-xs italic">
//                               No image
//                             </span>
//                           );
//                         }
//                       })()}
//                     </td>
//                     <td className="px-4 py-2 text-green-300">
//                       ₹{product.price}
//                     </td>
//                     <td className="px-4 py-2 text-yellow-300">
//                       ₹{product.discountPrice}
//                     </td>
//                     <td className="px-4 py-2">{product.stock}</td>
//                     <td className="px-4 py-2">{product.categoryId}</td>
//                     <td className="px-4 py-2">
//                       <div className="flex gap-2">
//                         <button onClick={() => handleEdit(product.id)}>
//                           <Edit3 className="text-indigo-400 hover:text-indigo-200" />
//                         </button>
//                         <button onClick={() => handleDelete(product.id)}>
//                           <Trash2 className="text-pink-400 hover:text-pink-200" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center mt-6 gap-2 text-sm flex-wrap">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded border font-medium transition-all ${
//                 currentPage === 1
//                   ? "bg-gray-500 text-white cursor-not-allowed"
//                   : "bg-purple-600 text-white hover:bg-purple-700"
//               }`}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-4 py-2 rounded border font-medium transition-all ${
//                   currentPage === i + 1
//                     ? "bg-teal-600 text-white"
//                     : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded border font-medium transition-all ${
//                 currentPage === totalPages
//                   ? "bg-gray-500 text-white cursor-not-allowed"
//                   : "bg-pink-600 text-white hover:bg-pink-700"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//         {editModal && (
//           <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 overflow-auto pt-10">
//             <div className="bg-gray-900 text-white w-full max-w-3xl mx-4 rounded-lg shadow-xl p-6 relative">
//               <button
//                 className="absolute top-2 right-2 text-white hover:text-red-400 text-2xl"
//                 onClick={() => {
//                   setEditModal(false);
//                   setEditProduct(null);
//                 }}
//               >
//                 &times;
//               </button>

//               <h3 className="text-2xl font-bold mb-6 text-teal-300">
//                 {editProduct ? "Edit Product" : "Add Product"}
//               </h3>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="name"
//                     defaultValue={editProduct?.name || ""}
//                     placeholder="Product Name"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                     required
//                   />

//                   <input
//                     type="number"
//                     name="price"
//                     defaultValue={editProduct?.price || ""}
//                     placeholder="Price"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                     required
//                   />

//                   <input
//                     type="number"
//                     name="discountPrice"
//                     defaultValue={editProduct?.discountPrice || ""}
//                     placeholder="Discount Price"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="text"
//                     name="offerType"
//                     defaultValue={editProduct?.offerType || ""}
//                     placeholder="Offer Type"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="text"
//                     name="categoryId"
//                     defaultValue={editProduct?.categoryId || ""}
//                     placeholder="Category ID"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="text"
//                     name="brand"
//                     defaultValue={editProduct?.brand || ""}
//                     placeholder="Brand"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="text"
//                     name="sizes"
//                     defaultValue={editProduct?.sizes?.join(", ") || ""}
//                     placeholder="Sizes (comma separated)"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="text"
//                     name="colors"
//                     defaultValue={editProduct?.colors?.join(", ") || ""}
//                     placeholder="Colors (comma separated)"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="number"
//                     name="stock"
//                     defaultValue={editProduct?.stock || ""}
//                     placeholder="Stock"
//                     className="bg-gray-800 border border-gray-700 p-2 rounded"
//                   />

//                   <input
//                     type="file"
//                     name="images"
//                     multiple
//                     className="bg-gray-800 border border-gray-700 p-2 rounded text-white"
//                   />
//                 </div>

//                 <textarea
//                   name="description"
//                   defaultValue={editProduct?.description || ""}
//                   placeholder="Product Description"
//                   className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
//                   rows={4}
//                 />

//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="isFeatured"
//                       defaultChecked={editProduct?.isFeatured === 1}
//                       className="accent-teal-600"
//                     />
//                     Featured
//                   </label>

//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       name="is_exclusive"
//                       defaultChecked={editProduct?.is_exclusive === 1}
//                       className="accent-pink-600"
//                     />
//                     Exclusive
//                   </label>
//                 </div>

//                 {/* Variants Section */}
//                 <div className="border-t border-gray-700 pt-4">
//                   <h4 className="text-lg font-semibold text-teal-300 mb-2">
//                     Product Variants
//                   </h4>

//                   {(editProduct?.variants || []).map((variant, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
//                     >
//                       <input
//                         type="text"
//                         name={`variant_color_${index}`}
//                         defaultValue={variant.color}
//                         placeholder="Color"
//                         className="bg-gray-800 border border-gray-700 p-2 rounded"
//                       />
//                       <input
//                         type="number"
//                         name={`variant_stock_${index}`}
//                         defaultValue={variant.stock}
//                         placeholder="Stock"
//                         className="bg-gray-800 border border-gray-700 p-2 rounded"
//                       />
//                       <input
//                         type="file"
//                         name={`variant_image_${index}`}
//                         className="bg-gray-800 border border-gray-700 p-2 rounded text-white"
//                       />
//                     </div>
//                   ))}

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setEditProduct((prev) => ({
//                         ...prev,
//                         variants: [
//                           ...(prev?.variants || []),
//                           { color: "", stock: 0 },
//                         ],
//                       }))
//                     }
//                     className="text-sm text-pink-400 hover:text-pink-200"
//                   >
//                     + Add Variant
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full mt-4 py-2 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white rounded font-semibold hover:scale-105 transition"
//                 >
//                   {editProduct ? "Update Product" : "Add Product"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default ProductPage;

import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProductById,
  editProductById,
  getAllProducts,
} from "@/utils/ApiUrlHelper";
import AdminLayout from "@/components/Sidebar/Sidebar";
import { Edit3, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [productForm, setProductForm] = useState({ variants: [] });
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProducts();
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  // const handleEdit = (id) => {
  //   const product = products.find((p) => p.id === id);
  //   const safeParse = (value, fallback = []) => {
  //     try {
  //       return JSON.parse(value);
  //     } catch {
  //       return fallback;
  //     }
  //   };
  //   const parsed = {
  //     ...product,
  //     sizes: Array.isArray(product.sizes)
  //       ? product.sizes
  //       : safeParse(product.sizes),
  //     colors: Array.isArray(product.colors)
  //       ? product.colors
  //       : safeParse(product.colors),
  //     images: Array.isArray(product.images)
  //       ? product.images
  //       : safeParse(product.images),
  //     categoryId: Array.isArray(product.categoryId)
  //       ? product.categoryId
  //       : safeParse(product.categoryId),
  //     variants: Array.isArray(product.variants)
  //       ? product.variants
  //       : safeParse(product.variants),
  //   };
  //   setEditProduct(parsed);
  //   setProductForm({ variants: parsed.variants });
  //   setEditModal(true);
  // };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    const safeParse = (value, fallback = []) => {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    };

    const parsedVariants = safeParse(product.variants).map((variant) => ({
      color: variant.color,
      stock: variant.stock,
      images: variant.images || "", // IMPORTANT
    }));

    const parsed = {
      ...product,
      sizes: safeParse(product.sizes),
      colors: safeParse(product.colors),
      images: safeParse(product.images),
      categoryId: safeParse(product.categoryId),
      variants: parsedVariants,
      isFeatured: product.isFeatured === 1,
      is_exclusive: product.is_exclusive === 1,
    };

    setEditProduct(parsed);
    setProductForm({ variants: parsedVariants });
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(res.message || "Product deleted");
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const form = e.target;
  //   const formData = new FormData(form);

  //   const variants = [];
  //   for (let i = 0; i < productForm.variants.length; i++) {
  //     const color = form[`variant_color_${i}`]?.value;
  //     const stock = form[`variant_stock_${i}`]?.value;
  //     const image = form[`variant_image_${i}`]?.files?.[0];
  //     if (color && stock) {
  //       const variant = { color, stock };
  //       if (image) variant.image = image;
  //       variants.push(variant);
  //     }
  //   }
  //   formData.append("variants", JSON.stringify(variants));
  //   formData.set(
  //     "sizes",
  //     JSON.stringify(form.sizes.value.split(",").map((s) => s.trim()))
  //   );
  //   formData.set(
  //     "colors",
  //     JSON.stringify(form.colors.value.split(",").map((c) => c.trim()))
  //   );

  //   try {
  //     if (editProduct?.id) {
  //       await editProductById(editProduct.id, formData);
  //       toast.success("Product updated successfully");
  //     } else {
  //       await createProduct(formData);
  //       toast.success("Product added successfully");
  //     }
  //     setEditModal(false);
  //     setEditProduct(null);
  //     setProductForm({ variants: [] });
  //     const updated = await getAllProducts();
  //     setProducts(updated);
  //   } catch (err) {
  //     toast.error("Operation failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const variantImages = form["variantImages"]?.files || [];
    const variants = [];

    for (let i = 0; i < productForm.variants.length; i++) {
      const color = form[`variant_color_${i}`]?.value;
      const stock = form[`variant_stock_${i}`]?.value;
      const image = variantImages[i];

      if (color && stock) {
        const variant = { color, stock };
        if (image) variant.image = image;
        variants.push(variant);
      }
    }

    Array.from(variantImages).forEach((file) => {
      formData.append("variantImages", file);
    });

    formData.set(
      "sizes",
      JSON.stringify(form.sizes.value.split(",").map((s) => s.trim()))
    );
    formData.set(
      "colors",
      JSON.stringify(form.colors.value.split(",").map((c) => c.trim()))
    );
    formData.append("variants", JSON.stringify(variants));
    formData.set("isFeatured", form.isFeatured.checked ? 1 : 0);
    formData.set("is_exclusive", form.is_exclusive.checked ? 1 : 0);

    try {
      if (editProduct?.id) {
        await editProductById(editProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product added successfully");
      }
      setEditModal(false);
      setEditProduct(null);
      setProductForm({ variants: [] });
      const updated = await getAllProducts();
      setProducts(updated);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleAddVariant = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { color: "", stock: 0 }],
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-extrabold text-teal-400">
            All Products
          </h2>
          <button
            className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white font-semibold px-5 py-2 rounded shadow-lg hover:scale-105 transition-all"
            onClick={() => {
              setEditProduct(null);
              setProductForm({ variants: [] });
              setEditModal(true);
            }}
          >
            Add Product
          </button>
        </div>

        {currentProducts.length === 0 ? (
          <p className="text-gray-400 italic">No products found.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-xl shadow-xl">
            <table className="min-w-full text-sm text-white">
              <thead className="bg-teal-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Discount</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-teal-800/40 transition"
                  >
                    <td className="px-4 py-2">{product.id}</td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">
                      {/* {(() => {
                          const images = Array.isArray(product.images)
                            ? product.images
                            : JSON.parse(product.images || "[]");
                          const mainImage = images[0];
                          return mainImage ? (
                            <img
                              src={`http://localhost:3008${mainImage.replace(
                                "/uploads",
                                ""
                              )}`}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded shadow-md"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs italic">
                              No image
                            </span>
                          );
                        })()} */}
                      {(() => {
                        let images = [];

                        try {
                          images = Array.isArray(product.images)
                            ? product.images
                            : JSON.parse(product.images || "[]");
                        } catch {
                          images = [];
                        }

                        const mainImage = images[0];

                        if (mainImage) {
                          return (
                            <img
                              src={`http://localhost:3008${mainImage}`}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded shadow-md"
                            />
                          );
                        } else {
                          return (
                            <span className="text-gray-500 text-xs italic">
                              No image
                            </span>
                          );
                        }
                      })()}
                    </td>
                    <td className="px-4 py-2 text-green-300">
                      ₹{product.price}
                    </td>
                    <td className="px-4 py-2 text-yellow-300">
                      ₹{product.discountPrice}
                    </td>
                    <td className="px-4 py-2">{product.stock}</td>
                    <td className="px-4 py-2">{product.categoryId}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product.id)}>
                          <Edit3 className="text-indigo-400 hover:text-indigo-200" />
                        </button>
                        <button onClick={() => handleDelete(product.id)}>
                          <Trash2 className="text-pink-400 hover:text-pink-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2 text-sm flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border font-medium transition-all ${
                  currentPage === i + 1
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded border font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {editModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 overflow-auto pt-10">
            <div className="bg-gray-900 text-white w-full max-w-3xl mx-4 rounded-lg shadow-xl p-6 relative">
              <button
                className="absolute top-2 right-2 text-white hover:text-red-400 text-2xl"
                onClick={() => {
                  setEditModal(false);
                  setEditProduct(null);
                }}
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-6 text-teal-300">
                {editProduct ? "Edit Product" : "Add Product"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    defaultValue={editProduct?.name || ""}
                    placeholder="Product Name"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    defaultValue={editProduct?.price || ""}
                    placeholder="Price"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="discountPrice"
                    defaultValue={editProduct?.discountPrice || ""}
                    placeholder="Discount Price"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="offerType"
                    defaultValue={editProduct?.offerType || ""}
                    placeholder="Offer Type"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="categoryId"
                    defaultValue={editProduct?.categoryId || ""}
                    placeholder="Category ID"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="brand"
                    defaultValue={editProduct?.brand || ""}
                    placeholder="Brand"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="sizes"
                    defaultValue={editProduct?.sizes?.join(", ") || ""}
                    placeholder="Sizes (comma separated)"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="colors"
                    defaultValue={editProduct?.colors?.join(", ") || ""}
                    placeholder="Colors (comma separated)"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editProduct?.stock || ""}
                    placeholder="Stock"
                    className="bg-gray-800 border border-gray-700 p-2 rounded"
                  />
                  <input
                    type="file"
                    name="images"
                    multiple
                    className="bg-gray-800 border border-gray-700 p-2 rounded text-white"
                  />
                </div>

                <textarea
                  name="description"
                  defaultValue={editProduct?.description || ""}
                  placeholder="Product Description"
                  className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
                  rows={4}
                />

                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      defaultChecked={editProduct?.isFeatured === 1}
                      className="accent-teal-600"
                    />
                    Featured
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_exclusive"
                      defaultChecked={editProduct?.is_exclusive === 1}
                      className="accent-pink-600"
                    />
                    Exclusive
                  </label>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-teal-300 mb-2">
                    Product Variants
                  </h4>
                  {/* {(productForm?.variants || []).map((variant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
                      >
                        <input
                          type="text"
                          name={`variant_color_${index}`}
                          defaultValue={variant.color}
                          placeholder="Color"
                          className="bg-gray-800 border border-gray-700 p-2 rounded"
                        />
                        <input
                          type="number"
                          name={`variant_stock_${index}`}
                          defaultValue={variant.stock}
                          placeholder="Stock"
                          className="bg-gray-800 border border-gray-700 p-2 rounded"
                        />
                        <input
                          type="file"
                          name="variantImages"
                          multiple
                          className="bg-gray-800 border border-gray-700 p-2 rounded text-white"
                        />
                      </div>
                    ))} */}
                  {(productForm?.variants || []).map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
                    >
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          name={`variant_color_${index}`}
                          defaultValue={variant.color}
                          placeholder="Color"
                          className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          name={`variant_stock_${index}`}
                          defaultValue={variant.stock}
                          placeholder="Stock"
                          className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Image
                        </label>
                        <input
                          type="file"
                          name="variantImages"
                          multiple
                          className="bg-gray-800 border border-gray-700 p-2 rounded text-white w-full"
                        />
                        {variant.images ? (
                          <img
                            src={`http://localhost:3008/uploads${variant.images}`}
                            alt="Variant"
                            className="mt-2 w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-xs text-gray-400 italic mt-1 block">
                            No image uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-sm text-pink-400 hover:text-pink-200"
                  >
                    + Add Variant
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-2 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white rounded font-semibold hover:scale-105 transition"
                >
                  {editProduct ? "Update Product" : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductPage;
