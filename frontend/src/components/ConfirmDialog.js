function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-600 dark:bg-red-950 dark:text-red-400">
            !
          </div>

          <div className="flex-1">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {message}
            </p>

          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;