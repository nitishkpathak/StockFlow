import { useEffect, useMemo, useState } from "react";

import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    userName: "",
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

  // Fetch users
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllUsers();

        setUsers(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        console.error(
          "Error loading users:",
          err
        );

        if (err.response?.status === 403) {
          setError(
            "You are not authorized to manage users."
          );

          showToast(
            "You are not authorized to manage users.",
            "error"
          );
        } else if (err.response?.status === 401) {
          setError(
            "Your session has expired. Please login again."
          );
        } else {
          setError("Failed to load users.");

          showToast(
            "Failed to load users.",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle input
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
      email: "",
      password: "",
      role: "STAFF",
    });

    setEditingUser(null);
    setShowForm(false);
    setError("");
  };

  // Open add form
  const handleAddClick = () => {
    setEditingUser(null);

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "STAFF",
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Open edit form
  const handleEditClick = (user) => {
    setEditingUser(user);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "STAFF",
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit add/update
  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const role = formData.role;

    // Name validation
    if (!name) {
      showToast(
        "Name is required.",
        "error"
      );
      return;
    }

    if (name.length < 2) {
      showToast(
        "Name must contain at least 2 characters.",
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

    // Password validation
    if (!editingUser && !password.trim()) {
      showToast(
        "Password is required.",
        "error"
      );
      return;
    }

    if (
      !editingUser &&
      password.length < 6
    ) {
      showToast(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    if (
      editingUser &&
      password.trim() &&
      password.length < 6
    ) {
      showToast(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    // Role validation
    if (
      role !== "ADMIN" &&
      role !== "STAFF"
    ) {
      showToast(
        "Please select a valid role.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const userData = {
        name,
        email,
        password,
        role,
      };

      // Update user
      if (editingUser) {
        const response = await updateUser(
          editingUser.id,
          userData
        );

        setUsers((previousUsers) =>
          previousUsers.map((user) =>
            user.id === editingUser.id
              ? response.data
              : user
          )
        );

        showToast(
          "User updated successfully.",
          "success"
        );
      }

      // Add user
      else {
        const response = await addUser(
          userData
        );

        setUsers((previousUsers) => [
          response.data,
          ...previousUsers,
        ]);

        showToast(
          "User added successfully.",
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
        "Error saving user:",
        err
      );

      if (err.response?.status === 403) {
        showToast(
          "You are not authorized to perform this action.",
          "error"
        );
      } else if (
        typeof err.response?.data === "string"
      ) {
        showToast(
          err.response.data,
          "error"
        );
      } else if (
        err.response?.data?.message
      ) {
        showToast(
          err.response.data.message,
          "error"
        );
      } else {
        showToast(
          editingUser
            ? "Failed to update user."
            : "Failed to add user.",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Open delete dialog
  const handleDelete = (user) => {
    setDeleteDialog({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
  };

  // Cancel delete
  const cancelDeleteUser = () => {
    setDeleteDialog({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  // Confirm delete
  const confirmDeleteUser = async () => {
    const userId = deleteDialog.userId;

    if (!userId) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteUser(userId);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      if (
        editingUser &&
        editingUser.id === userId
      ) {
        resetForm();
      }

      showToast(
        "User deleted successfully.",
        "success"
      );

      cancelDeleteUser();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Error deleting user:",
        err
      );

      if (err.response?.status === 403) {
        showToast(
          "You are not authorized to delete users.",
          "error"
        );
      } else if (
        typeof err.response?.data === "string"
      ) {
        showToast(
          err.response.data,
          "error"
        );
      } else {
        showToast(
          "Failed to delete user.",
          "error"
        );
      }

      cancelDeleteUser();
    } finally {
      setDeleting(false);
    }
  };

  // Search users
  const filteredUsers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name
          ?.toLowerCase()
          .includes(searchText) ||
        user.email
          ?.toLowerCase()
          .includes(searchText) ||
        user.role
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [users, search]);

  const adminCount = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const staffCount = users.filter(
    (user) => user.role === "STAFF"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText={
          deleting
            ? "Deleting..."
            : "Delete User"
        }
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
      />

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                User Management
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
                Manage StockFlow users, roles and
                account access.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddClick}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950 sm:w-auto"
            >
              + Add User
            </button>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Total Users
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm dark:border-purple-900 dark:bg-purple-950/30">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Admin
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-700 dark:text-purple-300">
              {adminCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900 dark:bg-blue-950/30">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Staff Members
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
              {staffCount}
            </p>
          </div>

        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingUser
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {editingUser
                    ? "Update the account information below."
                    : "Create a new StockFlow user account."}
                </p>
              </div>

              {editingUser && (
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  Editing User
                </span>
              )}

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                  required={!editingUser}
                  autoComplete={
                    editingUser
                      ? "new-password"
                      : "new-password"
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-950"
                />

                <p className="mt-1.5 text-xs text-slate-400 dark:text-gray-500">
                  Minimum 6 characters.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-950"
                >
                  <option value="STAFF">
                    STAFF
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Add User"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Users List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">

          {/* List Header */}
          <div className="border-b border-slate-200 p-5 dark:border-gray-700 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  All Users
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1
                    ? "user"
                    : "users"}{" "}
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
                  placeholder="Search by name, email or role..."
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
                  Loading users...
                </p>

              </div>

            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[300px] items-center justify-center px-6">

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-gray-800">
                  {search ? "🔍" : "👥"}
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                  {search
                    ? "No users found"
                    : "No users available"}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-gray-400">
                  {search
                    ? "Try a different search term."
                    : "Create your first user using the Add User button."}
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
            /* Users Table */
            <div className="overflow-x-auto">

              <table className="min-w-[850px] w-full text-left">

                <thead className="bg-slate-50 dark:bg-gray-800">

                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Role
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">

                  {filteredUsers.map(
                    (user) => (

                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-gray-800"
                      >

                        {/* User */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-slate-900 dark:text-white">
                                {user.name}
                              </p>

                              <p className="text-xs text-slate-400 dark:text-gray-500">
                                ID #{user.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Email */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-gray-300">
                          {user.email}
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditClick(
                                  user
                                )
                              }
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(user)
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                            >
                              Delete
                            </button>

                          </div>

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

export default Users;