type Props = {
  error?: string | null;
  success?: boolean;
  successMessage?: string;
};

/** Avisos bajo el título de la barra sticky (siguen al scrollear). */
export function AdminStickyAlerts({
  error,
  success,
  successMessage = "Cambios guardados correctamente.",
}: Props) {
  if (!error && !success) return null;

  return (
    <div className="admin-sticky-toolbar__alerts">
      {error ? (
        <p className="admin-alert-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="admin-alert-success" role="status">
          {successMessage}
        </p>
      ) : null}
    </div>
  );
}
