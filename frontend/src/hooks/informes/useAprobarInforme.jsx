import Swal from "sweetalert2";
import { aprobarInforme } from "@services/informe.service.js";

async function confirmAprobarAlert() {
  await Swal.fire({
    title: "Informe aprobado",
    text: "El informe fue aprobado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmAprobarError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo aprobar el informe",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useAprobarInforme = (fetchInformes) => {
  const handleAprobarInforme = async (id) => {
    try {
      await aprobarInforme(id);
      await confirmAprobarAlert();
      await fetchInformes();
    } catch (error) {
      console.error("Error al aprobar informe:", error);
      confirmAprobarError();
    }
  };

  return { handleAprobarInforme };
};

export default useAprobarInforme;