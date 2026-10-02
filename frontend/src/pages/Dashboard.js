import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getAllProducts } from "../services/productService";
import { getAllTransactions } from "../services/stockTransactionService";

import {
  getCurrentUser,
  getCompanyName,
} from "../services/authService";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Logged-in user information
  const user = getCurrentUser();
  const companyName = getCompanyName();

  // ---------------------------------------
  // Fetch dashboard data
  // ---------------------------------------

  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const [productsResponse, transactionsResponse] =
          await Promise.all([
            getAllProducts(),
            getAllTransactions(),
          ]);

        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );

        setTransactions(
          Array.isArray(transactionsResponse.data)
            ? transactionsResponse.data
            : []
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        setProducts([]);
        setTransactions([]);

        if (err.response?.status === 403) {
          setError(
            "You do not have permission to view dashboard data."
          );
        } else if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            "Unable to load dashboard data. Please try again."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ---------------------------------------
  // Transaction type helper
  // Supports old and new values
  // ---------------------------------------

  const getTransactionType = (type) => {
    const normalizedType = String(type || "").toUpperCase();

    if (
      normalizedType === "IN" ||
      normalizedType === "INCREASE"
    ) {
      return "IN";
    }

    if (
      normalizedType === "OUT" ||
      normalizedType === "DECREASE"
    ) {
      return "OUT";
    }

    return normalizedType;
  };

  // ---------------------------------------
  // Inventory calculations
  // ---------------------------------------

  const totalProducts = products.length;

  const totalStock = useMemo(() => {
    return products.reduce(
      (total, product) =>
        total + (Number(product.quantity) || 0),
      0
    );
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const quantity = Number(product.quantity) || 0;
      return quantity > 0 && quantity < 5;
    });
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => {
      const quantity = Number(product.quantity) || 0;
      return quantity === 0;
    });
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce((total, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 0;

      return total + price * quantity;
    }, 0);
  }, [products]);

  // ---------------------------------------
  // Stock movement calculations
  // ---------------------------------------

  const stockIn = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          getTransactionType(transaction.type) === "IN"
      )
      .reduce(
        (total, transaction) =>
          total +
          Math.abs(Number(transaction.quantity) || 0),
        0
      );
  }, [transactions]);

  const stockOut = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          getTransactionType(transaction.type) === "OUT"
      )
      .reduce(
        (total, transaction) =>
          total +
          Math.abs(Number(transaction.quantity) || 0),
        0
      );
  }, [transactions]);

  // ---------------------------------------
  // Chart data
  // ---------------------------------------

  const stockChartData = useMemo(() => {
    return products.map((product) => ({
      name:
        product.name && product.name.length > 14
          ? `${product.name.substring(0, 14)}...`
          : product.name || "Unnamed",
      quantity: Number(product.quantity) || 0,
    }));
  }, [products]);

  const inventoryValueChartData = useMemo(() => {
    return products.map((product) => ({
      name:
        product.name && product.name.length > 14
          ? `${product.name.substring(0, 14)}...`
          : product.name || "Unnamed",
      value:
        (Number(product.price) || 0) *
        (Number(product.quantity) || 0),
    }));
  }, [products]);

  const stockStatusData = useMemo(() => {
    const inStockProducts = products.filter(
      (product) =>
        (Number(product.quantity) || 0) >= 5
    ).length;

    return [
      {
        name: "In Stock",
        value: inStockProducts,
      },
      {
        name: "Low Stock",
        value: lowStockProducts.length,
      },
      {
        name: "Out of Stock",
        value: outOfStockProducts.length,
      },
    ].filter((item) => item.value > 0);
  }, [
    products,
    lowStockProducts,
    outOfStockProducts,
  ]);

  const chartColors = [
    "#16a34a",
    "#f59e0b",
    "#dc2626",
  ];

  // ---------------------------------------
  // Recent transactions
  // ---------------------------------------

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const dateA =
          new Date(a.createdAt).getTime() || 0;

        const dateB =
          new Date(b.createdAt).getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [transactions]);

  // ---------------------------------------
  // Helpers
  // ---------------------------------------

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStockStatus = (quantity) => {
    const stock = Number(quantity) || 0;

    if (stock === 0) {
      return {
        text: "Out of Stock",
        className:
          "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
      };
    }

    if (stock < 5) {
      return {
        text: "Low Stock",
        className:
          "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
      };
    }

    return {
      text: "In Stock",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    };
  };

  // ---------------------------------------
  // Loading state
  // ---------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />

          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-gray-300">
            Loading dashboard...
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
            Fetching your inventory data
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Error state
  // ---------------------------------------

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm dark:border-red-900 dark:bg-gray-900">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            !
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
            Unable to Load Dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 transition-colors dark:bg-gray-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =========================================
            Dashboard Header
        ========================================== */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Monitor your inventory and stock performance.
            </p>

            {/* Company Information */}
            <div className="mt-4 flex flex-wrap items-center gap-2">

              <span className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                <span>🏢</span>
                {companyName || "Company"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <span>👤</span>
                {user?.name || "User"}
              </span>

              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  user?.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                    : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {user?.role || "STAFF"}
              </span>
            </div>
          </div>

          {/* Right Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Inventory Value */}
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Inventory Value
              </p>

              <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(inventoryValue)}
              </p>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span
                className={
                  refreshing ? "animate-spin" : ""
                }
              >
                ↻
              </span>

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* =========================================
            Summary Cards
        ========================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Products */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {totalProducts}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-950/40">
                📦
              </div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  Total Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {totalStock}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-950/40">
                📊
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-500">
                  {lowStockProducts.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl dark:bg-orange-950/40">
                ⚠️
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  Out of Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {outOfStockProducts.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl dark:bg-red-950/40">
                🚨
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            Stock Movement
        ========================================== */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Stock In */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Stock In
            </p>

            <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-400">
              +{stockIn}
            </p>

            <p className="mt-1 text-xs text-green-600 dark:text-green-500">
              Units added
            </p>
          </div>

          {/* Stock Out */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Stock Out
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-400">
              -{stockOut}
            </p>

            <p className="mt-1 text-xs text-red-600 dark:text-red-500">
              Units removed
            </p>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-700 dark:text-purple-400">
              {transactions.length}
            </p>

            <p className="mt-1 text-xs text-purple-600 dark:text-purple-500">
              Stock movements
            </p>
          </div>
        </div>

        {/* =========================================
            No Products
        ========================================== */}
        {products.length === 0 && (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-semibold text-blue-900 dark:text-blue-300">
                  No products available
                </h2>

                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                  Add products to your inventory to see charts and stock information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            Charts
        ========================================== */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* Stock Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Stock by Product
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Current quantity of each product
              </p>
            </div>

            <div className="h-80">
              {products.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No product data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stockChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 35,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-40"
                    />

                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={65}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                      dataKey="quantity"
                      name="Stock"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Inventory Value */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Inventory Value
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Current value of inventory by product
              </p>
            </div>

            <div className="h-80">
              {products.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No product data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryValueChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 35,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-40"
                    />

                    <XAxis
                      dataKey="name"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={65}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />

                    <Bar
                      dataKey="value"
                      name="Value"
                      fill="#16a34a"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            Stock Status / Low Stock / Summary
        ========================================== */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Stock Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Stock Status
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Overall inventory status
              </p>
            </div>

            <div className="h-64">
              {stockStatusData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No stock data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={82}
                      label
                    >
                      {stockStatusData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index]}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mb-5 flex items-start justify-between gap-3">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Low Stock
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Products needing attention
                </p>
              </div>

              {lowStockProducts.length > 0 && (
                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                  {lowStockProducts.length}
                </span>
              )}
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="rounded-xl bg-green-50 p-5 text-center dark:bg-green-950/30">

                <div className="text-2xl">
                  ✓
                </div>

                <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">
                  All products have sufficient stock.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {lowStockProducts
                  .slice(0, 5)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-gray-800"
                    >
                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                          Quantity:{" "}
                          {Number(product.quantity) || 0}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                        Low
                      </span>
                    </div>
                  ))}

                {lowStockProducts.length > 5 && (
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    View all low-stock products
                  </button>
                )}

              </div>
            )}
          </div>

          {/* Inventory Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Inventory Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Quick overview
              </p>
            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-gray-800">
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  Products
                </span>

                <span className="font-semibold text-slate-900 dark:text-white">
                  {totalProducts}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                <span className="text-sm text-blue-700 dark:text-blue-400">
                  Total Units
                </span>

                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  {totalStock}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4 dark:bg-orange-950/30">
                <span className="text-sm text-orange-700 dark:text-orange-400">
                  Low Stock
                </span>

                <span className="font-semibold text-orange-700 dark:text-orange-400">
                  {lowStockProducts.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-red-50 p-4 dark:bg-red-950/30">
                <span className="text-sm text-red-700 dark:text-red-400">
                  Out of Stock
                </span>

                <span className="font-semibold text-red-700 dark:text-red-400">
                  {outOfStockProducts.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 dark:bg-green-950/30">
                <span className="text-sm text-green-700 dark:text-green-400">
                  Inventory Value
                </span>

                <span className="font-semibold text-green-700 dark:text-green-400">
                  {formatCurrency(inventoryValue)}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================
            Recent Stock Activity
        ========================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Stock Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Latest stock movements
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/stock-history")}
              className="text-left text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:text-right"
            >
              View all →
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="px-5 py-12 text-center">

              <div className="text-3xl">
                📋
              </div>

              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                No stock activity available.
              </p>

              <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                Stock movements will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] text-left">

                <thead className="bg-slate-50 dark:bg-gray-800">
                  <tr>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Product
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Type
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {recentTransactions.map(
                    (transaction) => {
                      const type =
                        getTransactionType(
                          transaction.type
                        );

                      const isStockIn =
                        type === "IN";

                      return (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                        >

                          <td className="px-5 py-4">

                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {transaction.product?.name ||
                                "Unknown Product"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                              Product ID: #
                              {transaction.product?.id ||
                                "-"}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isStockIn
                                  ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              }`}
                            >
                              {isStockIn
                                ? "Stock In"
                                : "Stock Out"}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`text-sm font-semibold ${
                                isStockIn
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {isStockIn ? "+" : "-"}
                              {Math.abs(
                                Number(
                                  transaction.quantity
                                ) || 0
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500 dark:text-gray-400">
                            {formatDate(
                              transaction.createdAt
                            )}
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

        {/* =========================================
            Products Overview
        ========================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Products Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Current inventory products
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="text-left text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:text-right"
            >
              Manage Products →
            </button>
          </div>

          {products.length === 0 ? (
            <div className="px-5 py-12 text-center">

              <div className="text-3xl">
                📦
              </div>

              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                No products available.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Product
              </button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left">

                <thead className="bg-slate-50 dark:bg-gray-800">
                  <tr>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Product
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Price
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Quantity
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {products.map((product) => {
                    const status =
                      getStockStatus(
                        product.quantity
                      );

                    const price =
                      Number(product.price) || 0;

                    const quantity =
                      Number(product.quantity) || 0;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                      >

                        <td className="px-5 py-4">

                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {product.name ||
                              "Unnamed Product"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
                            ID: #{product.id}
                          </p>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {product.category?.name ||
                            "Uncategorized"}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {formatCurrency(price)}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-gray-200">
                          {quantity}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.text}
                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>

            </div>
          )}
        </div>

        <div className="h-6" />

      </div>
    </div>
  );
}

export default Dashboard;