import Swal from "sweetalert2";
import { dejarObservacion } from "@services/informe.service.js";

async function confirmObservacionAlert() {
  await Swal.fire({
    title: "Observación agregada",
    text: "La observación fue registrada correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmObservacionError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo dejar la observación",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useDejarObservacion = (fetchInformes) => {
  const handleDejarObservacion = async (id, observacion) => {
    try {
      await dejarObservacion(id, observacion);
      await confirmObservacionAlert();
      await fetchInformes();
    } catch (error) {
      console.error("Error al dejar observación:", error);
      confirmObservacionError();
    }
  };

  return { handleDejarObservacion };
};

export default useDejarObservacion;