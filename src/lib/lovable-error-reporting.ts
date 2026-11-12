type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

export function reportLovableError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: Partial<LovableErrorOptions> = {},
) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: context.source ?? "client",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: options.mechanism ?? "manual",
      handled: options.handled ?? false,
      severity: options.severity ?? "error",
    },
  );
}

/** Call once on the client to capture unhandled errors and promise rejections. */
export function setupErrorMonitoring() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    const err = event.error ?? new Error(event.message || "Unknown error");
    reportLovableError(err, {
      source: "window.onerror",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    }, {
      mechanism: "onerror",
      handled: false,
      severity: "error",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const err = reason instanceof Error ? reason : new Error(String(reason));
    reportLovableError(err, {
      source: "unhandledrejection",
    }, {
      mechanism: "unhandledrejection",
      handled: false,
      severity: "error",
    });
  });

  console.info("[Error monitoring] Client-side handlers installed");
}
