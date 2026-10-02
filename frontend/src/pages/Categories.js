import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import { isAdmin } from "../services/authService";

import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Categories() {
  const admin = isAdmin();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deleteDialog, setDeleteDialog] =
    useState({
      isOpen: false,
      id: null,
      name: "",
    });

  // Show toast
  const showToast = useCallback(
    (message, type = "success") => {
      setToast({
        message,
        type,
      });
    },
    []
  );

  // Close toast
  const closeToast = useCallback(() => {
    setToast({
      message: "",
      type: "success",
    });
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response =
          await getAllCategories();

        setCategories(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error
        );

        if (
          error.response?.status === 403
        ) {
          setError(
            "You do not have permission to view categories."
          );
        } else if (
          error.response?.status === 401
        ) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError(
            "Unable to load categories."
          );
        }
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    []
  );

  // Load page
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategories();
  }, [fetchCategories]);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingId(null);
    setError("");
  };

  // Edit category
  const handleEdit = (category) => {
    if (!admin) {
      return;
    }

    setEditingId(category.id);

    setFormData({
      name: category.name || "",
      description:
        category.description || "",
    });

    setError("");
    closeToast();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!admin) {
      showToast(
        "Only ADMIN can add or update categories.",
        "error"
      );
      return;
    }

    const categoryName =
      formData.name.trim();

    const description =
      formData.description.trim();

    // Validation
    if (!categoryName) {
      showToast(
        "Please enter category name.",
        "error"
      );
      return;
    }

    if (categoryName.length < 2) {
      showToast(
        "Category name must contain at least 2 characters.",
        "error"
      );
      return;
    }

    if (!description) {
      showToast(
        "Please enter category description.",
        "error"
      );
      return;
    }

    if (description.length < 3) {
      showToast(
        "Category description must contain at least 3 characters.",
        "error"
      );
      return;
    }

    const categoryData = {
      name: categoryName,
      description,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        const response =
          await updateCategory(
            editingId,
            categoryData
          );

        setCategories(
          (previousCategories) =>
            previousCategories.map(
              (category) =>
                category.id === editingId
                  ? response.data
                  : category
            )
        );

        showToast(
          "Category updated successfully!",
          "success"
        );
      } else {
        const response =
          await addCategory(
            categoryData
          );

        setCategories(
          (previousCategories) => [
            response.data,
            ...previousCategories,
          ]
        );

        showToast(
          "Category added successfully!",
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
        "Category save error:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        showToast(
          "You do not have permission to perform this action.",
          "error"
        );
      } else if (
        error.response?.status === 409
      ) {
        showToast(
          "This category already exists.",
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
          editingId !== null
            ? "Unable to update category."
            : "Unable to add category.",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (
    category
  ) => {
    if (!admin) {
      return;
    }

    setDeleteDialog({
      isOpen: true,
      id: category.id,
      name: category.name,
    });
  };

  // Cancel delete
  const cancelDelete = () => {
    if (deletingId !== null) {
      return;
    }

    setDeleteDialog({
      isOpen: false,
      id: null,
      name: "",
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    const categoryId =
      deleteDialog.id;

    if (!categoryId || !admin) {
      return;
    }

    try {
      setDeletingId(categoryId);

      await deleteCategory(categoryId);

      setCategories(
        (previousCategories) =>
          previousCategories.filter(
            (category) =>
              category.id !== categoryId
          )
      );

      if (editingId === categoryId) {
        resetForm();
      }

      setDeleteDialog({
        isOpen: false,
        id: null,
        name: "",
      });

      showToast(
        "Category deleted successfully!",
        "success"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Error deleting category:",
        error
      );

      setDeleteDialog({
        isOpen: false,
        id: null,
        name: "",
      });

      if (
        error.response?.status === 403
      ) {
        showToast(
          "You do not have permission to delete categories.",
          "error"
        );
      } else if (
        error.response?.status === 404
      ) {
        showToast(
          "Category not found.",
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
          "Unable to delete category.",
          "error"
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Search categories
  const filteredCategories =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      if (!search) {
        return categories;
      }

      return categories.filter(
        (category) => {
          const name =
            category.name?.toLowerCase() ||
            "";

          const description =
            category.description?.toLowerCase() ||
            "";

          return (
            name.includes(search) ||
            description.includes(search)
          );
        }
      );
    }, [categories, searchTerm]);

  // Statistics
  const totalCategories =
    categories.length;

  const showingCategories =
    filteredCategories.length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText={
          deletingId !== null
            ? "Deleting..."
            : "Delete Category"
        }
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Categories
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Organize products into manageable categories.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {totalCategories}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 shadow-sm dark:border-blue-900 dark:bg-blue-950/40">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Showing
                </p>

                <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
                  {showingCategories}
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
                fetchCategories()
              }
              className="w-fit rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

            <div className="flex-1">

              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Search Categories
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search by category name or description..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              />

            </div>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
              }}
              disabled={!searchTerm}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:w-auto"
            >
              Clear Search
            </button>

            <button
              type="button"
              onClick={() =>
                fetchCategories(false)
              }
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>

          </div>

        </div>

        {/* Add / Edit Form */}
        {admin && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6"
          >

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingId !== null
                    ? "Edit Category"
                    : "Add New Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {editingId !== null
                    ? "Update the category details below."
                    : "Create a new category for your products."}
                </p>
              </div>

              {editingId !== null && (
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  Editing Category
                </span>
              )}

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950 dark:disabled:bg-gray-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  required
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950 dark:disabled:bg-gray-800"
                />
              </div>

            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Category"
                  : "Add Category"}
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

        {/* Category List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

          <div className="border-b border-slate-200 p-5 dark:border-gray-700 sm:p-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Category List
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {admin
                    ? "Manage your product categories."
                    : "View available product categories."}
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-gray-800 dark:text-gray-300">
                {showingCategories}{" "}
                {showingCategories === 1
                  ? "Category"
                  : "Categories"}
              </span>

            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Loading categories...
                </p>

              </div>

            </div>
          ) : filteredCategories.length === 0 ? (

            /* Empty State */
            <div className="flex min-h-[320px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-gray-800">
                  {searchTerm
                    ? "🔍"
                    : "📁"}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {searchTerm
                    ? "No categories found"
                    : "No categories available"}
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-gray-400">
                  {searchTerm
                    ? "Try a different search term."
                    : admin
                    ? "Add your first category using the form above."
                    : "There are currently no categories available."}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Clear Search
                  </button>
                )}

              </div>

            </div>
          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="min-w-[760px] w-full">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Category
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

                  {filteredCategories.map(
                    (category) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                      >

                        {/* ID */}
                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-gray-400">
                          #{category.id}
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                              {category.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "C"}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-900 dark:text-white">
                                {category.name}
                              </p>

                              <p className="text-xs text-slate-400 dark:text-gray-500">
                                Category #{category.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Description */}
                        <td className="max-w-md px-5 py-4 text-sm text-slate-600 dark:text-gray-300">

                          <span
                            title={
                              category.description ||
                              ""
                            }
                            className="block truncate"
                          >
                            {category.description ||
                              "No description"}
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          {admin ? (
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    category
                                  )
                                }
                                disabled={
                                  saving ||
                                  deletingId !==
                                    null
                                }
                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteClick(
                                    category
                                  )
                                }
                                disabled={
                                  saving ||
                                  deletingId !==
                                    null
                                }
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                              >
                                Delete
                              </button>

                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                                View Only
                              </span>
                            </div>
                          )}

                        </td>

                      </tr>
                    )
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

export default Categories;