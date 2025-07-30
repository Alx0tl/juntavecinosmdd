import { useState } from "react";
import { rechazarAsamblea } from "@services/asamblea.service";

export function useObservacion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const rechazar = async (id, observacion) => {
    setLoading(true);
    setError(null);
    try {
      await rechazarAsamblea(id, observacion);
    } catch (err) {
      console.error("Error al rechazar:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { rechazar, loading, error };
}