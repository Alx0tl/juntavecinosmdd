import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getAsambleas, deleteAsamblea } from "@services/asamblea.service";
import { useAprobar } from "@hooks/juntas/useAprobar.jsx";
import { useObservacion } from "@hooks/juntas/useObservacion.jsx";

const AgendarJuntaPres = () => {
  const [asambleas, setAsambleas] = useState([]);
  const { aprobar } = useAprobar();
  const { rechazar } = useObservacion();

  useEffect(() => {
    cargarAsambleas();
  }, []);

  const cargarAsambleas = async () => {
    const todas = await getAsambleas();
    setAsambleas(todas);
  };

  const handleAprobar = async (id) => {
    await aprobar(id);
    cargarAsambleas();
    Swal.fire("Aprobada", "La asamblea fue aprobada", "success");
  };

  const handleRechazar = async (id) => {
    const { value: texto } = await Swal.fire({
      title: "Rechazar Asamblea",
      input: "text",
      inputLabel: "Observación",
      inputPlaceholder: "Motivo del rechazo...",
      showCancelButton: true,
    });

    if (texto) {
      await rechazar(id, texto);
      cargarAsambleas();
      Swal.fire("Rechazada", "La asamblea fue rechazada", "info");
    }
  };

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar Asamblea?",
      text: "Esta acción es irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      await deleteAsamblea(id);
      cargarAsambleas();
      Swal.fire("Eliminada", "La asamblea fue eliminada", "success");
    }
  };

  const aprobadas = asambleas.filter((a) => a.estado === "aprobada" && a.fase === "futura");
  const otras = asambleas.filter(
    (a) => ["pendiente", "observada"].includes(a.estado) && ["futura", "agendada"].includes(a.fase)
  );

  return (
    <div className="container mt-4">
      <h2>Fechas Agendadas</h2>

      <h4>Asambleas Aprobadas</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {aprobadas.map((a) => (
            <tr key={a.id}>
              <td>{new Date(a.fecha).toLocaleDateString()}</td>
              <td>{a.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-4">Pendientes / Observadas</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {otras.map((a) => (
            <tr key={a.id}>
              <td>{new Date(a.fecha).toLocaleDateString()}</td>
              <td>{a.descripcion}</td>
              <td>{a.estado}</td>
              <td>
                {a.estado === "pendiente" && (
                  <>
                    <button onClick={() => handleAprobar(a.id)} className="btn btn-success btn-sm me-2">Aceptar</button>
                    <button onClick={() => handleRechazar(a.id)} className="btn btn-warning btn-sm">Rechazar</button>
                  </>
                )}
                {a.estado === "observada" && (
                  <>
                    <span title={a.observaciones}>{a.observaciones || "Sin detalle"}</span>
                    <button onClick={() => handleEliminar(a.id)} className="btn btn-danger btn-sm ms-2">Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgendarJuntaPres;