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
import { PencilLine, PlusCircle } from "lucide-react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProducts();
      if (data) {
        // Assuming data is an array, not an object containing 'products'
        setProducts(data || []);
      }
    };
    loadProducts();
  }, []);

  // Stub functions for handling edit and delete actions
  const handleEdit = (id) => {
    console.log("Edit product", id);
    const editProduct = products.find((p) => p.id === id);
    setEditProduct(editProduct);

    setEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteProductById(id);
      console.log("Delete Response ✅:", res);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(res.message || "Product deleted");
    } catch (error) {
      console.error("Delete failed ❌:", error);
      alert("Error deleting product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      if (editProduct && editProduct.id) {
        // 🛠 Edit flow
        await editProductById(editProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        // ➕ Add flow (implement this API if not yet created)
        await createProduct(formData);
        toast.success("Product added successfully");
      }

      // Close modal and refresh
      setEditModal(false);
      setEditProduct(null);
      const updated = await getAllProducts();
      setProducts(updated);
    } catch (err) {
      console.error("Form submit failed:", err);
      toast.error("Operation failed");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black  text-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-extrabold text-teal-400">
            All Products
          </h2>
          <button className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 text-white font-semibold px-5 py-2 rounded shadow-lg hover:scale-105 transition-all">
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
                      {(() => {
                        const images = Array.isArray(product.images)
                          ? product.images
                          : JSON.parse(product.images || "[]");
                        const mainImage = images[0];

                        if (mainImage) {
                          const cleanPath = mainImage.startsWith("/uploads")
                            ? mainImage.replace("/uploads", "")
                            : mainImage;

                          return (
                            <img
                              src={`http://ondcapi.elloweb.com/uploads/${cleanPath}`}
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
      </div>
    </AdminLayout>
  );
};

export default ProductPage;
