// src/helper/ApiUrlHelper.js or similar

import axios from "axios";

// const base_url = "http://localhost:3008";
const base_url = "http://ondcapi.elloweb.com";
// const base_url = "https://plenty-eels-look.loca.lt";

export const signup = async (data) => {
  try {
    const response = await axios.post(`${base_url}/api/users/register`, data);
    return response.data;
  } catch (error) {
    console.error("Signup API error:", error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${base_url}/api/users/login`, data);
    return response.data;
  } catch (error) {
    // Still throw error to be caught in component
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${base_url}/api/users/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const getExclusiveProducts = async () => {
//   try {
//     const response = await axios.get(`${base_url}/api/products/getallproducts`);

//     const exclusiveProductData = response.data.filter(
//       (products) => products.is_exclusive === 1
//     );
//     return exclusiveProductData;
//   } catch (error) {
//     console.error("Exclusive products fetch error:", error);
//     throw error;
//   }
// };

// export const getFeaturedProducts = async () => {
//   try {
//     const response = await axios.get(`${base_url}/api/products/getallproducts`);

//     const featuredProductData = response.data.filter(
//       (products) => products.isFeatured === 1
//     );
//     return featuredProductData;
//   } catch (error) {
//     console.error("Exclusive products fetch error:", error);
//     throw error;
//   }
// };

export const getExclusiveProducts = async () => {
  try {
    const response = await axios.get(
      `${base_url}/api/products/getallproducts`,
      {
        params: {
          exclusive: 1,
        },
      }
    );

    return response.data; // Already exclusive products only
  } catch (error) {
    console.error("Exclusive products fetch error:", error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(
      `${base_url}/api/products/getallproducts`,
      {
        params: {
          isFeatured: 1,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Featured products fetch error:", error);
    throw error;
  }
};

export const getAllProducts = async (filters = {}) => {
  try {
    const resposne = await axios.get(
      `${base_url}/api/products/getallproducts`,
      {
        params: filters,
      }
    );
    return resposne.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleProduct = async (id) => {
  try {
    const response = await axios.get(
      `${base_url}/api/products/single/product/${id}`
    );
    return response.data; // assuming API returns a single product object
  } catch (error) {
    console.error("Single product error:", error);
    throw error;
  }
};

export const handleAddProducttoCart = async (productId, quantity) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("User is not logged in");
    }

    const response = await axios.post(
      `${base_url}/api/products/cart/addtocart`,
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Add to cart API error:", error);
    throw error;
  }
};

export const getCartByUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token found → no need to call API → just return empty cart
    return [];
  }

  try {
    const response = await axios.get(`${base_url}/api/products/cart/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // assuming your backend returns array of cart items
  } catch (error) {
    console.error(
      "Fetch Cart Error:",
      error.response?.data?.message || error.message
    );
    return []; // Even if API call fails, return empty cart instead of crashing frontend
  }
};

export const removeCartItem = async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("User not authenticated");

  const response = await axios.delete(
    `${base_url}/api/products/cart/remove/cart/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("User not authenticated");

  const response = await axios.post(
    `${base_url}/api/orders/create/order`,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createRazorpayOrder = async (payload) => {
  const token = localStorage.getItem("token");
  // console.log(" createRazorpayOrder token:", token);
  if (!token) {
    throw new Error("No auth token found — user not logged in");
  }
  const res = await axios.post(
    `${base_url}/api/payment/razorpay/order`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const verifyRazorpaySignature = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${base_url}/api/payment/razorpay/verify`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const clearUserCartItem = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.delete(`${base_url}/api/products/cart/clear/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(" Clear cart error:", error);
    throw error;
  }
};

// export const getWishlistProductsByUser = async () => {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await axios.get(`${base_url}/api/wishlist/get/wishlist`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data || [];
//   } catch (err) {
//     console.error("Failed to fetch wishlist:", err);
//     return [];
//   }
// };

export const getWishlistProductsByUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token, skipping wishlist API call.");
    return []; // Return empty safely
  }

  try {
    const res = await axios.get(`${base_url}/api/wishlist/get/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    return []; // ✅ Instead of throw err, just return []
  }
};

export const addWishListProduct = async (productId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${base_url}/api/wishlist/add/wishlist`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      " Error adding to wishlist:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const removeFromWishlist = async (productId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `${base_url}/api/wishlist/remove/wishlist/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "Error removing from wishlist:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const getSearchProduct = async (query) => {
  try {
    const res = await axios.get(`${base_url}/api/products/getallproducts`, {
      params: { search: query },
    });
    return res.data;
  } catch (err) {
    console.error("Search product fetch error:", err);
    return [];
  }
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${base_url}/api/users/getuser/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${base_url}/api/users/profile`,
    profileData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getUserOrdersPaginated = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${base_url}/api/orders/user/orders?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${base_url}/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const rewardCoupon = async (payload) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${base_url}/api/coupons/reward`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const autoRewardCoupon = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${base_url}/api/coupons/auto-reward`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const applyCoupon = async (couponCode, cartTotal) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${base_url}/api/coupons/validate/apply`,
      {
        couponCode,
        cartTotal,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.coupon;
    // Example response: { couponCode: "WELCOME50", discountAmount: 100 }
  } catch (error) {
    console.error(
      "Apply coupon error:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to apply coupon");
  }
};

export const submitContactForm = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${base_url}/api/contactus/send-message`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Contact Form Submit Error:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to submit message."
    );
  }
};

export const getUserCoupons = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.get(`${base_url}/api/coupons/get/user/coupon`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteProductById = async (id) => {
  return await axios.delete(`${base_url}/api/products/delete/product/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const editProductById = async (id, formData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      `${base_url}/api/products/update/product/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update product failed:", error.response?.data || error);
    throw error;
  }
};
export const createProduct = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${base_url}/api/products/create/product`, // ← fixed slash
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create Product API error:", error);
    throw error.response?.data || error;
  }
};

export const getAllOrders = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();

    // Ensure correct query param names
    if (filters.orderStatus !== undefined && filters.orderStatus !== null) {
      params.append("orderStatus", filters.orderStatus);
    }

    if (filters.paymentStatus !== "") {
      params.append("paymentStatus", filters.paymentStatus);
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await axios.get(
      `${base_url}/api/orders/admin/getallorders?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data?.orders || response.data;
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${base_url}/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
};

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${base_url}/api/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
