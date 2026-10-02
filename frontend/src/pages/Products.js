import { useCallback, useEffect, useMemo, useState } from "react";

import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  increaseStock as increaseStockAPI,
  decreaseStock as decreaseStockAPI,
} from "../services/productService";

import { getAllCategories } from "../services/categoryService";
import { getAllSuppliers } from "../services/supplierService";

import {  isAdmin } from "../services/authService";

function Products() {
  const admin = isAdmin();

  // Product data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stockLoadingId, setStockLoadingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [stockFilter, setStockFilter] =
    useState("all");
  const [supplierFilter, setSupplierFilter] =
    useState("all");

  // Product form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  // Edit mode
  const [editingId, setEditingId] = useState(null);

  // Toast
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  // Delete dialog
  const [deleteDialog, setDeleteDialog] =
    useState({
      isOpen: false,
      productId: null,
      productName: "",
    });

  // --------------------------------------------------
  // Toast helpers
  // --------------------------------------------------

  const showToast = useCallback(
    (message, type = "success") => {
      setToast({
        message,
        type,
      });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast({
      message: "",
      type: "success",
    });
  }, []);

  // --------------------------------------------------
  // Load products, categories and suppliers
  // --------------------------------------------------

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        setLoading(true);

        const [
          productsResponse,
          categoriesResponse,
          suppliersResponse,
        ] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllSuppliers(),
        ]);

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setCategories(
          Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : []
        );

        setSuppliers(
          Array.isArray(suppliersResponse.data)
            ? suppliersResponse.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading product data:",
          error
        );

        if (error.response?.status === 403) {
          showToast(
            "You do not have permission to access this data.",
            "error"
          );
        } else if (
          error.response?.status === 401
        ) {
          showToast(
            "Your session has expired. Please login again.",
            "error"
          );
        } else {
          showToast(
            "Unable to load product data.",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  // --------------------------------------------------
  // Handle form input
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Reset form
  // --------------------------------------------------

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      price: "",
      quantity: "",
      description: "",
    });

    setCategoryId("");
    setSupplierId("");
  };

  // --------------------------------------------------
  // Edit product
  // --------------------------------------------------

  const handleEdit = (product) => {
    if (!admin) {
      showToast(
        "Only ADMIN users can edit products.",
        "error"
      );
      return;
    }

    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      price:
        product.price !== null &&
        product.price !== undefined
          ? String(product.price)
          : "",
      quantity:
        product.quantity !== null &&
        product.quantity !== undefined
          ? String(product.quantity)
          : "",
      description: product.description || "",
    });

    setCategoryId(
      product.category
        ? String(product.category.id)
        : ""
    );

    setSupplierId(
      product.supplier
        ? String(product.supplier.id)
        : ""
    );

    closeToast();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Open delete dialog
  // --------------------------------------------------

  const handleDelete = (product) => {
    if (!admin) {
      showToast(
        "You do not have permission to delete products.",
        "error"
      );
      return;
    }

    setDeleteDialog({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  // --------------------------------------------------
  // Cancel delete
  // --------------------------------------------------

  const cancelDeleteProduct = () => {
    setDeleteDialog({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  // --------------------------------------------------
  // Confirm delete
  // --------------------------------------------------

  const confirmDeleteProduct = async () => {
    const productId =
      deleteDialog.productId;

    if (!productId) {
      return;
    }

    try {
      await deleteProduct(productId);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) =>
            product.id !== productId
        )
      );

      if (editingId === productId) {
        resetForm();
      }

      cancelDeleteProduct();

      showToast(
        "Product deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      cancelDeleteProduct();

      showToast(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to delete product.",
        "error"
      );
    }
  };

  // --------------------------------------------------
  // Increase stock
  // --------------------------------------------------

  const increaseStock = async (product) => {
    if (!admin) {
      showToast(
        "Only ADMIN users can change stock.",
        "error"
      );
      return;
    }

    if (stockLoadingId !== null) {
      return;
    }

    try {
      setStockLoadingId(product.id);

      const response =
        await increaseStockAPI(
          product.id,
          1
        );

      setProducts((previousProducts) =>
        previousProducts.map((item) =>
          item.id === product.id
            ? response.data
            : item
        )
      );

      showToast(
        "Stock increased successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Error increasing stock:",
        error
      );

      showToast(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to increase stock.",
        "error"
      );
    } finally {
      setStockLoadingId(null);
    }
  };

  // --------------------------------------------------
  // Decrease stock
  // --------------------------------------------------

  const decreaseStock = async (product) => {
    if (!admin) {
      showToast(
        "Only ADMIN users can change stock.",
        "error"
      );
      return;
    }

    if (stockLoadingId !== null) {
      return;
    }

    if (
      Number(product.quantity) <= 0
    ) {
      showToast(
        "Stock cannot be less than 0.",
        "warning"
      );
      return;
    }

    try {
      setStockLoadingId(product.id);

      const response =
        await decreaseStockAPI(
          product.id,
          1
        );

      setProducts((previousProducts) =>
        previousProducts.map((item) =>
          item.id === product.id
            ? response.data
            : item
        )
      );

      showToast(
        "Stock decreased successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Error decreasing stock:",
        error
      );

      showToast(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Unable to decrease stock.",
        "error"
      );
    } finally {
      setStockLoadingId(null);
    }
  };

  // --------------------------------------------------
  // Validate product form
  // --------------------------------------------------

  const validateForm = () => {
    const name =
      formData.name.trim();

    const price =
      Number(formData.price);

    const quantity =
      Number(formData.quantity);

    const description =
      formData.description.trim();

    if (!name) {
      showToast(
        "Product name is required.",
        "error"
      );
      return false;
    }

    if (name.length < 2) {
      showToast(
        "Product name must contain at least 2 characters.",
        "error"
      );
      return false;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(price)
    ) {
      showToast(
        "Please enter a valid price.",
        "error"
      );
      return false;
    }

    if (price <= 0) {
      showToast(
        "Price must be greater than 0.",
        "error"
      );
      return false;
    }

    if (
      formData.quantity === "" ||
      !Number.isInteger(quantity)
    ) {
      showToast(
        "Quantity must be a whole number.",
        "error"
      );
      return false;
    }

    if (quantity < 0) {
      showToast(
        "Quantity cannot be negative.",
        "error"
      );
      return false;
    }

    if (!categoryId) {
      showToast(
        "Please select a category.",
        "error"
      );
      return false;
    }

    if (!supplierId) {
      showToast(
        "Please select a supplier.",
        "error"
      );
      return false;
    }

    if (!description) {
      showToast(
        "Description is required.",
        "error"
      );
      return false;
    }

    if (description.length < 3) {
      showToast(
        "Description must contain at least 3 characters.",
        "error"
      );
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // Add / Update product
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Only ADMIN can add or update products.
    if (!admin) {
      showToast(
        "Only ADMIN users can add or update products.",
        "error"
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    const productData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      description:
        formData.description.trim(),

      category: {
        id: Number(categoryId),
      },

      supplier: {
        id: Number(supplierId),
      },
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        const response =
          await updateProduct(
            editingId,
            productData
          );

        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product.id === editingId
              ? response.data
              : product
          )
        );

        showToast(
          "Product updated successfully!",
          "success"
        );
      } else {
        const response =
          await addProduct(productData);

        setProducts((previousProducts) => [
          response.data,
          ...previousProducts,
        ]);

        showToast(
          "Product added successfully!",
          "success"
        );
      }

      resetForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Error saving product:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        showToast(
          "You do not have permission to perform this action.",
          "error"
        );
      } else {
        showToast(
          typeof error.response?.data === "string"
            ? error.response.data
            : editingId !== null
            ? "Unable to update product."
            : "Unable to add product.",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Filter products
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const categoryName =
        product.category?.name?.toLowerCase() ||
        "";

      const supplierName =
        product.supplier?.name?.toLowerCase() ||
        "";

      const matchesSearch =
        !search ||
        productName.includes(search) ||
        categoryName.includes(search) ||
        supplierName.includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        String(product.category?.id) ===
          String(categoryFilter);

      const quantity =
        Number(product.quantity) || 0;

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "inStock"
          ? quantity >= 5
          : stockFilter === "lowStock"
          ? quantity > 0 && quantity < 5
          : quantity === 0;

      const matchesSupplier =
        supplierFilter === "all" ||
        String(product.supplier?.id) ===
          String(supplierFilter);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesSupplier
      );
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    stockFilter,
    supplierFilter,
  ]);

  // --------------------------------------------------
  // Active filter count
  // --------------------------------------------------

  const activeFilterCount =
    [
      searchTerm.trim(),

      categoryFilter !== "all"
        ? categoryFilter
        : "",

      stockFilter !== "all"
        ? stockFilter
        : "",

      supplierFilter !== "all"
        ? supplierFilter
        : "",
    ].filter(Boolean).length;

  // --------------------------------------------------
  // Clear filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockFilter("all");
    setSupplierFilter("all");

    showToast(
      "Filters cleared.",
      "info"
    );
  };

  // --------------------------------------------------
  // Product statistics
  // --------------------------------------------------

  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        total +
        (Number(product.quantity) || 0),
      0
    );

  const lowStockCount =
    products.filter((product) => {
      const quantity =
        Number(product.quantity) || 0;

      return quantity > 0 && quantity < 5;
    }).length;

  const outOfStockCount =
    products.filter(
      (product) =>
        Number(product.quantity) === 0
    ).length;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-950">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Loading products...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        onConfirm={confirmDeleteProduct}
        onCancel={cancelDeleteProduct}
      />

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Products
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    Manage products, stock levels,
                    categories and suppliers.
                  </p>

                </div>

              </div>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">

                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Products
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {totalProducts}
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">

                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total Stock
                </p>

                <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                  {totalStock}
                </p>

              </div>

              <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 shadow-sm dark:border-orange-900 dark:bg-orange-950/30">

                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Low Stock
                </p>

                <p className="mt-1 text-xl font-bold text-orange-700 dark:text-orange-300">
                  {lowStockCount}
                </p>

              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm dark:border-red-900 dark:bg-red-950/30">

                <p className="text-xs text-red-600 dark:text-red-400">
                  Out of Stock
                </p>

                <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300">
                  {outOfStockCount}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            SEARCH & FILTERS
        ================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Search & Filters
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Find products quickly using multiple filters.
              </p>

            </div>

            {activeFilterCount > 0 && (
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                {activeFilterCount} active{" "}
                {activeFilterCount === 1
                  ? "filter"
                  : "filters"}
              </span>
            )}

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* Search */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Search
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Product, category, supplier..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              />

            </div>

            {/* Category */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
              >

                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* Stock */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Stock Status
              </label>

              <select
                value={stockFilter}
                onChange={(event) =>
                  setStockFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
              >

                <option value="all">
                  All Stock
                </option>

                <option value="inStock">
                  In Stock
                </option>

                <option value="lowStock">
                  Low Stock
                </option>

                <option value="outOfStock">
                  Out of Stock
                </option>

              </select>

            </div>

            {/* Supplier */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Supplier
              </label>

              <select
                value={supplierFilter}
                onChange={(event) =>
                  setSupplierFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
              >

                <option value="all">
                  All Suppliers
                </option>

                {suppliers.map(
                  (supplier) => (
                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                      {supplier.company
                        ? ` - ${supplier.company}`
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500 dark:text-gray-400">

              Showing{" "}

              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredProducts.length}
              </span>{" "}

              of{" "}

              <span className="font-semibold text-slate-900 dark:text-white">
                {products.length}
              </span>{" "}

              products

            </p>

            <button
              type="button"
              onClick={clearFilters}
              disabled={
                activeFilterCount === 0
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto"
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* ==================================================
            PRODUCT FORM
            ADMIN ONLY
        ================================================== */}

        {admin && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
          >

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingId !== null
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {editingId !== null
                    ? "Update the product information below."
                    : "Enter the details to create a new product."}
                </p>

              </div>

              {editingId !== null && (
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  Editing Product
                </span>
              )}

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Product Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />

              </div>

              {/* Price */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                  />

                </div>

              </div>

              {/* Quantity */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Initial Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0"
                  step="1"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />

              </div>

              {/* Category */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Supplier */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Supplier
                </label>

                <select
                  value={supplierId}
                  onChange={(event) =>
                    setSupplierId(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
                >

                  <option value="">
                    Select Supplier
                  </option>

                  {suppliers.map(
                    (supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                        {supplier.company
                          ? ` - ${supplier.company}`
                          : ""}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    closeToast();
                  }}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>
        )}

        {/* ==================================================
            PRODUCT TABLE
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="border-b border-slate-200 p-5 dark:border-gray-700 sm:p-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Product List
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {admin
                    ? "Manage stock and product information."
                    : "View products and stock information."}
                </p>

              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "Product"
                  : "Products"}
              </span>

            </div>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="flex min-h-[320px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-gray-800">
                  {activeFilterCount > 0
                    ? "🔍"
                    : "📦"}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {activeFilterCount > 0
                    ? "No products match your filters"
                    : "No products available"}
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-gray-400">
                  {activeFilterCount > 0
                    ? "Try changing your search or filters."
                    : admin
                    ? "Add your first product using the form above."
                    : "No products are available for your company."}
                </p>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}

              </div>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Supplier
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Description
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {filteredProducts.map(
                    (product) => {

                      const quantity =
                        Number(
                          product.quantity
                        ) || 0;

                      const isStockLoading =
                        stockLoadingId ===
                        product.id;

                      return (

                        <tr
                          key={product.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                        >

                          {/* Product */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                {product.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "P"}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-slate-900 dark:text-white">
                                  {product.name}
                                </p>

                                <p className="text-xs text-slate-400 dark:text-gray-500">
                                  ID #{product.id}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Price */}
                          <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">

                            ₹
                            {Number(
                              product.price || 0
                            ).toFixed(2)}

                          </td>

                          {/* Quantity */}
                          <td className="px-5 py-4">

                            <span
                              className={`text-sm font-semibold ${
                                quantity === 0
                                  ? "text-red-600"
                                  : quantity < 5
                                  ? "text-orange-600"
                                  : "text-slate-700 dark:text-gray-300"
                              }`}
                            >
                              {quantity}
                            </span>

                          </td>

                          {/* Stock Controls */}
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              {/* Only ADMIN can decrease stock */}
                              {admin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseStock(
                                      product
                                    )
                                  }
                                  disabled={
                                    quantity === 0 ||
                                    isStockLoading
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-lg font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                                  aria-label="Decrease stock"
                                >
                                  −
                                </button>
                              )}

                              <span className="min-w-[32px] text-center text-sm font-semibold text-slate-700 dark:text-gray-300">
                                {isStockLoading
                                  ? "..."
                                  : quantity}
                              </span>

                              {/* Only ADMIN can increase stock */}
                              {admin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseStock(
                                      product
                                    )
                                  }
                                  disabled={
                                    isStockLoading
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-lg font-semibold text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
                                  aria-label="Increase stock"
                                >
                                  +
                                </button>
                              )}

                            </div>

                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">

                            {quantity === 0 ? (

                              <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:bg-red-950 dark:text-red-300">
                                Out of Stock
                              </span>

                            ) : quantity < 5 ? (

                              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                                Low Stock
                              </span>

                            ) : (

                              <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 dark:bg-green-950 dark:text-green-300">
                                In Stock
                              </span>

                            )}

                          </td>

                          {/* Category */}
                          <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                            {product.category?.name ||
                              "No Category"}
                          </td>

                          {/* Supplier */}
                          <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                            {product.supplier?.name ||
                              "No Supplier"}
                          </td>

                          {/* Description */}
                          <td className="max-w-xs px-5 py-4 text-sm text-slate-500 dark:text-gray-400">

                            <span
                              title={
                                product.description ||
                                ""
                              }
                              className="block truncate"
                            >
                              {product.description ||
                                "-"}
                            </span>

                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              {/* Only ADMIN can edit */}
                              {admin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      product
                                    )
                                  }
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                                >
                                  Edit
                                </button>
                              )}

                              {/* Only ADMIN can delete */}
                              {admin && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      product
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                                >
                                  Delete
                                </button>
                              )}

                              {!admin && (
                                <span className="text-xs text-slate-400 dark:text-gray-500">
                                  View only
                                </span>
                              )}

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Products;