export type LoadScriptOptions = {
  id?: string;
  defer?: boolean;
  type?: string;
  module?: boolean;
  /** Requerido en scripts ES module cross-origin para evitar conflictos con preload. */
  crossOrigin?: "anonymous" | "use-credentials";
  appendTo?: "head" | "body";
  onLoad?: () => void;
  onError?: () => void;
};

function scriptIdFromSrc(src: string, id?: string): string {
  if (id) return id;
  return `gnahs-${src.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 80)}`;
}

/**
 * Carga un script externo una sola vez. Si ya existe, reutiliza el nodo y dispara onLoad si ya cargó.
 */
export function loadScript(src: string, options?: LoadScriptOptions): () => void {
  const scriptId = scriptIdFromSrc(src, options?.id);
  const onLoad = options?.onLoad;

  const runOnLoad = () => onLoad?.();

  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (script) {
    if (script.dataset.gnahsLoaded === "true") {
      runOnLoad();
    } else if (onLoad) {
      script.addEventListener("load", runOnLoad, { once: true });
    }
    return () => {};
  }

  script = document.createElement("script");
  script.id = scriptId;
  script.src = src;
  if (options?.defer) script.defer = true;
  if (options?.module) {
    script.type = "module";
    if (!options.crossOrigin) {
      script.crossOrigin = "anonymous";
    }
  } else if (options?.type) {
    script.type = options.type;
  }
  if (options?.crossOrigin) {
    script.crossOrigin = options.crossOrigin;
  }

  const handleLoad = () => {
    script!.dataset.gnahsLoaded = "true";
    runOnLoad();
  };

  const handleError = () => {
    options?.onError?.();
    script?.remove();
  };

  script.addEventListener("load", handleLoad, { once: true });
  script.addEventListener("error", handleError, { once: true });

  const parent =
    options?.appendTo === "body" ? document.body : document.head;
  parent.appendChild(script);

  return () => {
    script?.removeEventListener("load", handleLoad);
  };
}
