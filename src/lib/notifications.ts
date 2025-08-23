// Notification and confirmation helpers (no-op implementations for now)
// Integrate with a UI toast/snackbar system later

export async function confirmAction(message: string): Promise<boolean> {
  // TODO: Replace with a proper non-blocking UI confirm dialog
  void message;
  return true;
}

export function notifySuccess(message: string): void {
  // TODO: Route to UI toast/snackbar
  void message;
}

export function notifyError(message: string): void {
  // TODO: Route to UI toast/snackbar
  void message;
}


