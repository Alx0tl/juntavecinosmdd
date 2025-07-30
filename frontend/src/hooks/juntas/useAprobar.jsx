import { useState } from "react";
import { aprobarAsamblea } from "@services/asamblea.service";

export function useAprobar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const aprobar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await aprobarAsamblea(id);
    } catch (err) {
      console.error("Error al aprobar:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { aprobar, loading, error };
}