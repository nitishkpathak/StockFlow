import { useEffect } from "react";

function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const styles = {
    success: {
      container:
        "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
      icon: "✓",
    },

    error: {
      container:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
      icon: "✕",
    },

    warning: {
      container:
        "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
      icon: "!",
    },

    info: {
      container:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
      icon: "i",
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className="fixed right-5 top-5 z-[9999] w-[calc(100%-2.5rem)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${currentStyle.container}`}
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
          {currentStyle.icon}
        </div>

        <p className="flex-1 text-sm font-medium leading-6">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-lg leading-none opacity-60 transition hover:opacity-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;