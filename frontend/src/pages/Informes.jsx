import { useEffect, useState, useCallback } from "react";
import cookies from "js-cookie";

const API_URL = "http://localhost:3000/api/informes";

const Informes = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.role;
  const [informes, setInformes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [obsId, setObsId] = useState(null);
  const [obsText, setObsText] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => cookies.get("jwt-auth");

  // Fetch informes

  const fetchInformes = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setInformes(data.data || []);
    } catch {
      alert("Error al cargar informes");
    }
  }, []);

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
  const handleCrearInforme = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al crear informe");
      } else {
        setTitle("");
        setContent("");
        fetchInformes();
      }
    } catch {
      alert("Error al crear informe");
    }
    setLoading(false);
  };

  // Editar informe (solo tesorero)
  const startEdit = (informe) => {
    setEditId(informe.id);
    setEditTitle(informe.title);
    setEditContent(informe.content);
  };

  const handleEditarInforme = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al editar informe");
      } else {
        setEditId(null);
        setEditTitle("");
        setEditContent("");
        fetchInformes();
      }
    } catch {
      alert("Error al editar informe");
    }
    setLoading(false);
  };

  // Dejar observación (solo presidente)
  const startObs = (informe) => {
    setObsId(informe.id);
    setObsText("");
  };

  const handleDejarObservacion = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}/observacion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ observacion: obsText }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al dejar observación");
      } else {
        setObsId(null);
        setObsText("");
        fetchInformes();
      }
    } catch {
      alert("Error al dejar observación");
    }
    setLoading(false);
  };

  // Aprobar informe (solo presidente)
  const handleAprobarInforme = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}/aprobar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al aprobar informe");
      } else {
        fetchInformes();
      }
    } catch {
      alert("Error al aprobar informe");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Informes Financieros</h2>
      {userRole === "Tesorero" && (
        <form onSubmit={handleCrearInforme}>
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
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Contenido</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th>
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
                        onClick={() => handleEditarInforme(informe.id)}
                        disabled={loading}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(informe)}
                      disabled={loading}
                    >
                      Editar
                    </button>
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
                        onClick={() => handleDejarObservacion(informe.id)}
                        disabled={loading || !obsText}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setObsId(null)}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startObs(informe)}
                        disabled={loading}
                      >
                        Dejar Observación
                      </button>
                      {!informe.observaciones && (
                        <button
                          onClick={() => handleAprobarInforme(informe.id)}
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