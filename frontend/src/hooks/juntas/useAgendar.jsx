import { useState } from "react";
import Swal from "sweetalert2";
import { postAsambleas } from "@services/asamblea.service.js";

export function useAgendar() {
  const [loading, setLoading] = useState(false);

  const agendarAsamblea = async (asambleaData) => {
    setLoading(true);
    try {
      const response = await postAsambleas(asambleaData);
      Swal.fire({
        icon: "success",
        title: "¡Asamblea agendada!",
        text: "La asamblea se registró correctamente.",
      });
      return response;
    } catch (error) {
      console.error("Error al agendar asamblea:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar la asamblea. Intenta nuevamente.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    agendarAsamblea,
    loading,
  };
}