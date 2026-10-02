import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getAllTransactions } from "../services/stockTransactionService";

function StockHistory() {
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch stock history
  const fetchTransactions = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response =
          await getAllTransactions();

        setTransactions(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching stock history:",
          error
        );

        if (error.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else if (
          error.response?.status === 403
        ) {
          setError(
            "You do not have permission to view stock history."
          );
        } else {
          setError(
            "Unable to load stock history."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Load page at top
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTransactions();
  }, [fetchTransactions]);

  // Normalize transaction type
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

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return transactions.filter(
      (transaction) => {
        const type = getTransactionType(
          transaction.type
        );

        const productName =
          transaction.product?.name
            ?.toLowerCase() || "";

        const productId =
          String(
            transaction.product?.id || ""
          );

        const transactionId =
          String(transaction.id || "");

        const matchesSearch =
          !search ||
          productName.includes(search) ||
          productId.includes(search) ||
          transactionId.includes(search);

        const matchesType =
          typeFilter === "all" ||
          type === typeFilter;

        return (
          matchesSearch &&
          matchesType
        );
      }
    );
  }, [
    transactions,
    searchTerm,
    typeFilter,
  ]);

  // Statistics
  const totalTransactions =
    transactions.length;


  const totalStockIn =
    transactions
      .filter(
        (transaction) =>
          getTransactionType(
            transaction.type
          ) === "IN"
      )
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.quantity) ||
            0),
        0
      );

  const totalStockOut =
    transactions
      .filter(
        (transaction) =>
          getTransactionType(
            transaction.type
          ) === "OUT"
      )
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.quantity) ||
            0),
        0
      );

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
  };

  const hasFilters =
    searchTerm.trim() !== "" ||
    typeFilter !== "all";

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

          <p className="text-sm text-slate-500 dark:text-gray-400">
            Loading stock history...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Stock History
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Track all stock movements and inventory changes.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Transactions
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {totalTransactions}
                </p>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm dark:border-green-900 dark:bg-green-950/30">
                <p className="text-xs text-green-600 dark:text-green-400">
                  Stock In
                </p>

                <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-300">
                  {totalStockIn}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm dark:border-red-900 dark:bg-red-950/30">
                <p className="text-xs text-red-600 dark:text-red-400">
                  Stock Out
                </p>

                <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300">
                  {totalStockOut}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-blue-950/30">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Showing
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
                  {filteredTransactions.length}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between">

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                fetchTransactions()
              }
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">

          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Search & Filters
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Search by product or transaction ID and filter stock movements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                placeholder="Product name or ID..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Stock Movement
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
              >
                <option value="all">
                  All Movements
                </option>

                <option value="IN">
                  Stock In
                </option>

                <option value="OUT">
                  Stock Out
                </option>
              </select>
            </div>

          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalTransactions}
              </span>{" "}
              transactions
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Clear Filters
              </button>

              <button
                type="button"
                onClick={() =>
                  fetchTransactions(false)
                }
                disabled={refreshing}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </div>

        </div>

        {/* History Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="border-b border-slate-200 p-5 dark:border-gray-700 sm:p-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Stock Movement History
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  Latest stock transactions are shown first.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                {filteredTransactions.length}{" "}
                {filteredTransactions.length ===
                1
                  ? "Record"
                  : "Records"}
              </span>

            </div>

          </div>

          {filteredTransactions.length ===
          0 ? (
            /* Empty State */
            <div className="flex min-h-[320px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-gray-800">
                  {hasFilters
                    ? "🔍"
                    : "📦"}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {hasFilters
                    ? "No matching transactions"
                    : "No stock transactions found"}
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-gray-400">
                  {hasFilters
                    ? "Try changing your search or filters."
                    : "Stock movements will appear here when inventory changes."}
                </p>

                {hasFilters && (
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

              <table className="min-w-[850px] w-full">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Action
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Date & Time
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {filteredTransactions.map(
                    (transaction) => {

                      const type =
                        getTransactionType(
                          transaction.type
                        );

                      const quantity =
                        Number(
                          transaction.quantity
                        ) || 0;

                      const isStockIn =
                        type === "IN";

                      return (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                        >

                          {/* ID */}
                          <td className="px-6 py-5 text-sm text-slate-500 dark:text-gray-400">
                            #{transaction.id}
                          </td>

                          {/* Product */}
                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                {transaction.product?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "P"}
                              </div>

                              <div>

                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {transaction.product?.name ||
                                    "Unknown Product"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                                  Product ID:{" "}
                                  {transaction.product?.id ||
                                    "-"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Action */}
                          <td className="px-6 py-5">

                            {isStockIn ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 dark:bg-green-950/40 dark:text-green-400">
                                <span>↑</span>
                                Stock In
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                <span>↓</span>
                                Stock Out
                              </span>
                            )}

                          </td>

                          {/* Quantity */}
                          <td className="px-6 py-5">

                            <span
                              className={`text-sm font-bold ${
                                isStockIn
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {isStockIn
                                ? "+"
                                : "-"}
                              {quantity}
                            </span>

                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-sm text-slate-600 dark:text-gray-300">
                            {transaction.createdAt
                              ? new Date(
                                  transaction.createdAt
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    dateStyle:
                                      "medium",
                                    timeStyle:
                                      "short",
                                  }
                                )
                              : "-"}
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

export default StockHistory;