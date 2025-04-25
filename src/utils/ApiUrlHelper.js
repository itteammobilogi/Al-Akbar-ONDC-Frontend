// src/helper/ApiUrlHelper.js or similar

import axios from "axios";

const base_url = "http://localhost:5000";
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

export const getExclusiveProducts = async () => {
  try {
    const response = await axios.get(`${base_url}/api/products/getallproducts`);

    const exclusiveProductData = response.data.filter(
      (products) => products.is_exclusive === 1
    );
    return exclusiveProductData;
  } catch (error) {
    console.error("Exclusive products fetch error:", error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${base_url}/api/products/getallproducts`);

    const featuredProductData = response.data.filter(
      (products) => products.isFeatured === 1
    );
    return featuredProductData;
  } catch (error) {
    console.error("Exclusive products fetch error:", error);
    throw error;
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
    // simply return empty array rather than throw
    return [];
  }
  const response = await axios.get(`${base_url}/api/products/cart/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
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
  console.log("👉 createRazorpayOrder token:", token);
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

export const getWishlistProductsByUser = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${base_url}/api/wishlist/get/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    return [];
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
  if (!token) throw new Error("User not authenticated");

  const response = await axios.get(`${base_url}/api/users/getuserprofile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};
