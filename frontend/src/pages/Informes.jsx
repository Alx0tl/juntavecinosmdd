import { useEffect, useState } from "react";
import { useInformes } from "@hooks/informes/useInformes.jsx";
import useDeleteInforme from "@hooks/informes/useDeleteInforme.jsx";
import useEditInforme from "@hooks/informes/useEditInforme.jsx";
import "@styles/informes.css";

const Informes = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.role;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [obsId, setObsId] = useState(null);
  const [obsText, setObsText] = useState("");

  const {
    informes,
    fetchInformes,
    loading,
    handleCrearInforme,
    handleDejarObservacion,
    handleAprobarInforme,
  } = useInformes();
  const { handleDeleteInforme } = useDeleteInforme(fetchInformes);
  const { handleEditInforme } = useEditInforme(fetchInformes);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  // Notificación al tesorero si hay informes observados
  useEffect(() => {
    if (
      userRole === "Tesorero" &&
      informes.some((i) => i.estado === "observado" && i.observaciones)
    ) {
      alert("Tienes informes con observaciones pendientes de resolver.");
    }
  }, [informes, userRole]);

  // Crear informe (solo tesorero)
  const onCrearInforme = async (e) => {
    e.preventDefault();
    await handleCrearInforme(title, content);
    setTitle("");
    setContent("");
  };

  // Editar informe (solo tesorero)
  const startEdit = (informe) => {
    setEditId(informe.id);
    setEditTitle(informe.title);
    setEditContent(informe.content);
  };

  const onEditarInforme = async (id) => {
    await handleEditInforme(id, editTitle, editContent);
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };

  // Dejar observación (solo presidente)
  const startObs = (informe) => {
    setObsId(informe.id);
    setObsText("");
  };

  const onDejarObservacion = async (id) => {
    await handleDejarObservacion(id, obsText);
    setObsId(null);
    setObsText("");
  };

  // Aprobar informe (solo presidente)
  const onAprobarInforme = async (id) => {
    await handleAprobarInforme(id);
  };

  return (
    <div className="informes-page">
      <h2>Informes Financieros</h2>
      {userRole === "Tesorero" && (
        <form onSubmit={onCrearInforme}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            Crear Informe
          </button>
        </form>
      )}
      <table className="informes-table">
        <thead>
          <tr>
            <th className="text-left">Título</th>
            <th className="text-left">Contenido</th>
            <th className="text-left">Estado</th>
            <th className="text-left">Observaciones</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {informes.map((informe) => (
            <tr key={informe.id}>
              <td>
                {editId === informe.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    disabled={loading}
                  />
                ) : (
                  informe.title
                )}
              </td>
              <td>
                {editId === informe.id ? (
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    disabled={loading}
                  />
                ) : (
                  informe.content
                )}
              </td>
              <td>{informe.estado}</td>
              <td>{informe.observaciones || "-"}</td>
              <td>
                {userRole === "Tesorero" &&
                  ["pendiente", "observado"].includes(informe.estado) &&
                  (editId === informe.id ? (
                    <>
                      <button
                        className="edit" // Verde
                        onClick={() => onEditarInforme(informe.id)}
                        disabled={loading}
                      >
                        Guardar
                      </button>
                      <button
                        className="delete" // Rojo
                        onClick={() => setEditId(null)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit"
                        onClick={() => startEdit(informe)}
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDeleteInforme(informe.id)}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </>
                  ))}
                {userRole === "Presidente" &&
                  ["pendiente", "observado"].includes(informe.estado) &&
                  (obsId === informe.id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Observación"
                        value={obsText}
                        onChange={(e) => setObsText(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        className="edit" // Verde
                        onClick={() => onDejarObservacion(informe.id)}
                        disabled={loading || !obsText}
                      >
                        Guardar
                      </button>
                      <button
                        className="delete" // Rojo
                        onClick={() => setObsId(null)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="observacion"
                        onClick={() => startObs(informe)}
                        disabled={loading}
                      >
                        Dejar Observación
                      </button>
                      {!informe.observaciones && (
                        <button
                          className="aprobar"
                          onClick={() => onAprobarInforme(informe.id)}
                          disabled={loading}
                        >
                          Aprobar
                        </button>
                      )}
                    </>
                  ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Informes;