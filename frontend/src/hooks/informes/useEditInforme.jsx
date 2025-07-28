import Swal from "sweetalert2";
import { editarInforme } from "@services/informe.service.js";

async function confirmEditAlert() {
  await Swal.fire({
    title: "Informe editado",
    text: "El informe ha sido editado correctamente",
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

async function confirmEditError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo editar el informe",
    icon: "error",
    confirmButtonText: "Aceptar",
  });
}

export const useEditInforme = (fetchInformes) => {
  const handleEditInforme = async (informeId, title, content) => {
    try {
      await editarInforme(informeId, { title, content });
      await confirmEditAlert();
      await fetchInformes();
    } catch (error) {
      console.error("Error al editar informe:", error);
      confirmEditError();
    }
  };

  return { handleEditInforme };
};

export default useEditInforme;