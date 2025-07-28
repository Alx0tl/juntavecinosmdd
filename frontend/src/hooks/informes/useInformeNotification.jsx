import Swal from "sweetalert2";
import { useEffect } from "react";

const useInformeNotification = (userRole, informes) => {
  useEffect(() => {
    if (
      userRole === "Tesorero" &&
      informes.some((i) => i.estado === "observado" && i.observaciones)
    ) {
      Swal.fire({
        title: "¡Atención!",
        text: "Tienes informes con observaciones pendientes de resolver.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  }, [informes, userRole]);
};

export default useInformeNotification;