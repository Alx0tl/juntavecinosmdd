import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Calendario from "@components/Calendario.jsx";
import { useAgendar } from "@hooks/juntas/useAgendar.jsx";
import { useAprobar } from "@hooks/juntas/useAprobar.jsx";
import { useObservacion } from "@hooks/juntas/useObservacion.jsx";
import { getAsambleas, deleteAsamblea } from "@services/asamblea.service.js";
import { useAuth } from "@context/AuthContext.jsx";

const AgendarJunta = () => {
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const { agendarAsamblea } = useAgendar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !descripcion.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
    }

    const asambleaData = {
      fecha,
      descripcion,
      estado: "pendiente",
    };

    await agendarAsamblea(asambleaData);

    setFecha("");
    setDescripcion("");

    Swal.fire("Agendada", "La junta fue agendada exitosamente", "success");
  };

  return (
    <div className="container mt-4">
      <h2>Agendar Junta</h2>
      <form onSubmit={handleSubmit}>
        <Calendario onDateChange={setFecha} />
        <div className="mb-3">
          <label>Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agendar</button>
      </form>
    </div>
  );
};

export default AgendarJunta;