import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getAllProducts } from "../services/productService";
import { getAllTransactions } from "../services/stockTransactionService";

function Reports() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------
  // Fetch report data
  // ---------------------------------------

  const fetchReportData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const [
          productsResponse,
          transactionsResponse,
        ] = await Promise.all([
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
        console.error("Reports error:", err);

        if (err.response?.status === 403) {
          setError(
            "You do not have permission to view reports."
          );
        } else if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            "Failed to load report data. Please try again."
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
    fetchReportData();
  }, [fetchReportData]);

  // ---------------------------------------
  // Basic statistics
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
      const quantity =
        Number(product.quantity) || 0;

      return quantity > 0 && quantity < 5;
    }).length;
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (Number(product.quantity) || 0) === 0
    ).length;
  }, [products]);

  const inventoryValue = useMemo(() => {
    return products.reduce((total, product) => {
      const price =
        Number(product.price) || 0;

      const quantity =
        Number(product.quantity) || 0;

      return total + price * quantity;
    }, 0);
  }, [products]);

  // ---------------------------------------
  // Normalize transaction type
  // ---------------------------------------

  const getTransactionType = (type) => {
    const normalizedType =
      String(type || "").toUpperCase();

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

    return "UNKNOWN";
  };

  // ---------------------------------------
  // Stock movement statistics
  // ---------------------------------------

  const totalStockIn = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          getTransactionType(transaction.type) === "IN"
      )
      .reduce(
        (total, transaction) =>
          total +
          Math.abs(
            Number(transaction.quantity) || 0
          ),
        0
      );
  }, [transactions]);

  const totalStockOut = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          getTransactionType(transaction.type) === "OUT"
      )
      .reduce(
        (total, transaction) =>
          total +
          Math.abs(
            Number(transaction.quantity) || 0
          ),
        0
      );
  }, [transactions]);

  // ---------------------------------------
  // Product stock chart
  // ---------------------------------------

  const productStockData = useMemo(() => {
    return products.map((product) => ({
      name:
        product.name &&
        product.name.length > 15
          ? `${product.name.substring(0, 15)}...`
          : product.name || "Unnamed",
      stock:
        Number(product.quantity) || 0,
    }));
  }, [products]);

  // ---------------------------------------
  // Category stock chart
  // ---------------------------------------

  const categoryStockData = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      const categoryName =
        product.category?.name || "Uncategorized";

      const quantity =
        Number(product.quantity) || 0;

      categoryMap[categoryName] =
        (categoryMap[categoryName] || 0) +
        quantity;
    });

    return Object.entries(categoryMap)
      .map(([name, stock]) => ({
        name,
        stock,
      }))
      .sort((a, b) => b.stock - a.stock);
  }, [products]);

  // ---------------------------------------
  // Stock status chart
  // ---------------------------------------

  const stockStatusData = useMemo(() => {
    const inStock =
      totalProducts -
      lowStockProducts -
      outOfStockProducts;

    return [
      {
        name: "In Stock",
        value: Math.max(inStock, 0),
      },
      {
        name: "Low Stock",
        value: lowStockProducts,
      },
      {
        name: "Out of Stock",
        value: outOfStockProducts,
      },
    ].filter((item) => item.value > 0);
  }, [
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
  ]);

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
      .slice(0, 10);
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

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">
            Loading reports...
          </p>

        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Error
  // ---------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">

            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
              Unable to load reports
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchReportData(true)
              }
              disabled={refreshing}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing
                ? "Retrying..."
                : "Try Again"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Reports & Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Analyze your inventory and stock performance.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              fetchReportData(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >

            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Total Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {totalStock}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-500">
              {lowStockProducts}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Out of Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {outOfStockProducts}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Inventory Value
            </p>

            <p className="mt-2 text-xl font-bold text-green-600">
              {formatCurrency(inventoryValue)}
            </p>
          </div>

        </div>

        {/* Stock Movement Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">

            <p className="text-sm text-green-700 dark:text-green-400">
              Total Stock In
            </p>

            <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-400">
              +{totalStockIn}
            </p>

            <p className="mt-1 text-xs text-green-600 dark:text-green-500">
              Units added to inventory
            </p>

          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">

            <p className="text-sm text-red-700 dark:text-red-400">
              Total Stock Out
            </p>

            <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-400">
              -{totalStockOut}
            </p>

            <p className="mt-1 text-xs text-red-600 dark:text-red-500">
              Units removed from inventory
            </p>

          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">

            <p className="text-sm text-blue-700 dark:text-blue-400">
              Total Transactions
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-400">
              {transactions.length}
            </p>

            <p className="mt-1 text-xs text-blue-600 dark:text-blue-500">
              Recorded stock movements
            </p>

          </div>

        </div>

        {/* Charts */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Product Stock */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
              Stock by Product
            </h2>

            <div className="h-80">

              {productStockData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No product data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={productStockData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 30,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200 dark:stroke-gray-700"
                    />

                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      height={60}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="stock"
                      name="Stock"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

          {/* Category Stock */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
              Stock by Category
            </h2>

            <div className="h-80">

              {categoryStockData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No category data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={categoryStockData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 30,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200 dark:stroke-gray-700"
                    />

                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      height={60}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="stock"
                      name="Stock"
                      fill="#16a34a"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              )}

            </div>
          </div>

          {/* Stock Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">

            <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
              Stock Status
            </h2>

            <div className="h-80">

              {stockStatusData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-gray-400">
                  No stock data available.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={stockStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stockStatusData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              [
                                "#16a34a",
                                "#f97316",
                                "#dc2626",
                              ][index]
                            }
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

        </div>

        {/* Inventory Summary */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-slate-200 p-5 dark:border-gray-800">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Inventory Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Detailed product-level inventory information.
            </p>

          </div>

          {products.length === 0 ? (
            <div className="px-5 py-12 text-center">

              <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
                No products available.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Add products to see inventory details here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

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
                      Value
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {products.map((product) => {

                    const quantity =
                      Number(product.quantity) || 0;

                    const price =
                      Number(product.price) || 0;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                      >

                        <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {product.name ||
                            "Unnamed Product"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {product.category?.name ||
                            "Uncategorized"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {formatCurrency(price)}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-gray-200">
                          {quantity}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-green-600">
                          {formatCurrency(
                            price * quantity
                          )}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Recent Transactions */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-slate-200 p-5 dark:border-gray-800">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Stock Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Latest stock movement in your inventory.
            </p>

          </div>

          {recentTransactions.length === 0 ? (
            <div className="px-5 py-12 text-center">

              <p className="text-sm font-medium text-slate-600 dark:text-gray-300">
                No stock transactions found.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Stock movements will appear here after you increase or decrease product stock.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Product
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Action
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

                      const transactionType =
                        getTransactionType(
                          transaction.type
                        );

                      const isStockIn =
                        transactionType === "IN";

                      const quantity = Math.abs(
                        Number(
                          transaction.quantity
                        ) || 0
                      );

                      return (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                        >

                          <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">
                            {transaction.product?.name ||
                              "Unknown Product"}
                          </td>

                          <td className="px-5 py-4">

                            {transactionType ===
                            "UNKNOWN" ? (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                                Unknown
                              </span>
                            ) : (
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                  isStockIn
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                }`}
                              >
                                {isStockIn
                                  ? "Stock In"
                                  : "Stock Out"}
                              </span>
                            )}

                          </td>

                          <td
                            className={`px-5 py-4 text-sm font-semibold ${
                              isStockIn
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transactionType ===
                            "UNKNOWN"
                              ? quantity
                              : isStockIn
                                ? `+${quantity}`
                                : `-${quantity}`}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
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

        <div className="h-6" />

      </div>
    </div>
  );
}

export default Reports;