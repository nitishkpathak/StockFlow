import { useEffect, useMemo, useState } from "react";

import {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierService";

import { isAdmin } from "../services/authService";

import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Suppliers() {
  const admin = isAdmin();

  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    supplierId: null,
    supplierName: "",
  });

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  // Close toast
  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  // Load suppliers
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllSuppliers();

        setSuppliers(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        console.error("Error loading suppliers:", err);

        if (err.response?.status === 403) {
          setError(
            "You do not have permission to view suppliers."
          );

          showToast(
            "You do not have permission to view suppliers.",
            "error"
          );
        } else if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError("Failed to load suppliers.");

          showToast(
            "Failed to load suppliers.",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // Handle phone input
  const handlePhoneChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((previousData) => ({
      ...previousData,
      phone: value,
    }));

    setError("");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingId(null);
    setError("");
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!admin) {
      showToast(
        "Only ADMIN can manage suppliers.",
        "error"
      );
      return;
    }

    const name = formData.name.trim();
    const company = formData.company.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();

    // Name validation
    if (!name) {
      showToast(
        "Supplier name is required.",
        "error"
      );
      return;
    }

    if (name.length < 2) {
      showToast(
        "Supplier name must contain at least 2 characters.",
        "error"
      );
      return;
    }

    // Company validation
    if (!company) {
      showToast(
        "Company name is required.",
        "error"
      );
      return;
    }

    if (company.length < 2) {
      showToast(
        "Company name must contain at least 2 characters.",
        "error"
      );
      return;
    }

    // Email validation
    if (!email) {
      showToast(
        "Email is required.",
        "error"
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showToast(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    // Phone validation
    if (!phone) {
      showToast(
        "Phone number is required.",
        "error"
      );
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showToast(
        "Phone number must contain exactly 10 digits.",
        "error"
      );
      return;
    }

    // Address validation
    if (!address) {
      showToast(
        "Address is required.",
        "error"
      );
      return;
    }

    if (address.length < 5) {
      showToast(
        "Address must contain at least 5 characters.",
        "error"
      );
      return;
    }

    const supplierData = {
      name,
      company,
      email,
      phone,
      address,
    };

    try {
      setSaving(true);
      setError("");

      // Update
      if (editingId !== null) {
        const response = await updateSupplier(
          editingId,
          supplierData
        );

        setSuppliers((previousSuppliers) =>
          previousSuppliers.map((supplier) =>
            supplier.id === editingId
              ? response.data
              : supplier
          )
        );

        showToast(
          "Supplier updated successfully.",
          "success"
        );
      }

      // Add
      else {
        const response = await addSupplier(
          supplierData
        );

        setSuppliers((previousSuppliers) => [
          response.data,
          ...previousSuppliers,
        ]);

        showToast(
          "Supplier added successfully.",
          "success"
        );
      }

      resetForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Error saving supplier:",
        err
      );

      if (err.response?.status === 403) {
        showToast(
          "You do not have permission to manage suppliers.",
          "error"
        );
      } else if (err.response?.status === 409) {
        showToast(
          "A supplier with these details already exists.",
          "error"
        );
      } else {
        showToast(
          editingId !== null
            ? "Failed to update supplier."
            : "Failed to add supplier.",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Edit supplier
  const handleEdit = (supplier) => {
    if (!admin) {
      return;
    }

    setFormData({
      name: supplier.name || "",
      company: supplier.company || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });

    setEditingId(supplier.id);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Open delete dialog
  const handleDelete = (supplier) => {
    if (!admin) {
      return;
    }

    setDeleteDialog({
      isOpen: true,
      supplierId: supplier.id,
      supplierName: supplier.name,
    });
  };

  // Cancel delete
  const cancelDeleteSupplier = () => {
    setDeleteDialog({
      isOpen: false,
      supplierId: null,
      supplierName: "",
    });
  };

  // Confirm delete
  const confirmDeleteSupplier = async () => {
    const supplierId =
      deleteDialog.supplierId;

    if (!supplierId) {
      return;
    }

    try {
      await deleteSupplier(supplierId);

      setSuppliers((previousSuppliers) =>
        previousSuppliers.filter(
          (supplier) =>
            supplier.id !== supplierId
        )
      );

      if (editingId === supplierId) {
        resetForm();
      }

      showToast(
        "Supplier deleted successfully.",
        "success"
      );

      cancelDeleteSupplier();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Error deleting supplier:",
        err
      );

      if (err.response?.status === 403) {
        showToast(
          "You do not have permission to delete suppliers.",
          "error"
        );
      } else if (err.response?.status === 404) {
        showToast(
          "Supplier not found.",
          "error"
        );
      } else {
        showToast(
          "Failed to delete supplier.",
          "error"
        );
      }

      cancelDeleteSupplier();
    }
  };

  // Search suppliers
  const filteredSuppliers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return suppliers;
    }

    return suppliers.filter((supplier) => {
      return (
        supplier.name
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.company
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.email
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.phone
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.address
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [suppliers, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Supplier"
          message={`Are you sure you want to delete "${deleteDialog.supplierName}"? This action cannot be undone.`}
          confirmText="Delete Supplier"
          cancelText="Cancel"
          onConfirm={confirmDeleteSupplier}
          onCancel={cancelDeleteSupplier}
        />

        {/* Page Header */}
        <div className="mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Suppliers
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
                Manage supplier information,
                contact details and supplier records.
              </p>
            </div>

            <div className="flex gap-3">

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Total Suppliers
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {suppliers.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Showing
                </p>

                <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredSuppliers.length}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Add / Edit Form */}
        {admin && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingId !== null
                    ? "Edit Supplier"
                    : "Add New Supplier"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {editingId !== null
                    ? "Update the supplier information below."
                    : "Enter the supplier information below."}
                </p>
              </div>

              {editingId !== null && (
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  Editing Supplier
                </span>
              )}

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Supplier Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Supplier Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="10-digit phone number"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                  />

                  <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500">
                    Enter exactly 10 digits.
                  </p>
                </div>

                {/* Address */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter supplier address"
                    required
                    rows={3}
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
                    ? "Update Supplier"
                    : "Add Supplier"}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel Edit
                  </button>
                )}

              </div>

            </form>

          </div>
        )}

        {/* Supplier List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

          {/* List Header */}
          <div className="border-b border-slate-200 p-5 dark:border-gray-700 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Supplier List
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {filteredSuppliers.length}{" "}
                  {filteredSuppliers.length === 1
                    ? "supplier"
                    : "suppliers"}{" "}
                  found
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-96">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name, company, email..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Loading suppliers...
                </p>

              </div>

            </div>
          ) : filteredSuppliers.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[300px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-gray-800">
                  {search ? "🔍" : "🏢"}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {search
                    ? "No suppliers found"
                    : "No suppliers available"}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-gray-400">
                  {search
                    ? "Try a different search term."
                    : admin
                    ? "Add your first supplier using the form above."
                    : "There are currently no suppliers available."}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
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

              <table className="min-w-[1050px] w-full text-left">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Supplier
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Company
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Address
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {filteredSuppliers.map(
                    (supplier) => (

                      <tr
                        key={supplier.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                      >

                        {/* Supplier */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                              {supplier.name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900 dark:text-white">
                                {supplier.name}
                              </p>

                              <p className="text-xs text-slate-400 dark:text-gray-500">
                                ID #{supplier.id}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Company */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {supplier.company || "-"}
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {supplier.email || "-"}
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {supplier.phone || "-"}
                        </td>

                        {/* Address */}
                        <td className="max-w-xs px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          <span
                            title={supplier.address || ""}
                            className="block truncate"
                          >
                            {supplier.address || "-"}
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
                                    supplier
                                  )
                                }
                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    supplier
                                  )
                                }
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                              >
                                Delete
                              </button>

                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400">
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

export default Suppliers;