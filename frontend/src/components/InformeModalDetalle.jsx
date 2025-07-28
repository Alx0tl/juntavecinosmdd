import React from "react";

const InformeModalDetalle = ({
  userRole,
  selectedInforme,
  editId,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  loading,
  handleEditInforme,
  setEditId,
  setSelectedInforme,
  setModalOpen,
  handleDeleteInforme,
  obsId,
  obsText,
  setObsId,
  setObsText,
  handleDejarObservacion,
  handleAprobarInforme,
  handleCloseModal,
}) => (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>{selectedInforme.title}</h3>
      <p>
        <strong>Fecha:</strong>{" "}
        {selectedInforme.createdAt
          ? new Date(selectedInforme.createdAt).toLocaleDateString()
          : "-"}
      </p>
      <p>
        <strong>Estado:</strong> {selectedInforme.estado}
      </p>
      <p>
        <strong>Contenido:</strong>
      </p>
      {editId === selectedInforme.id ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={loading}
            style={{ marginBottom: "1em", width: "100%" }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={loading}
            rows={10}
            style={{
              width: "100%",
              resize: "vertical",
              fontSize: "1em",
              padding: "8px",
              marginBottom: "1em",
              borderRadius: "4px",
              border: "1px solid #bdbdbd",
            }}
          />
          <button
            className="edit"
            onClick={async () => {
              await handleEditInforme(editId, editTitle, editContent);
              setEditId(null);
              setEditTitle("");
              setEditContent("");
              setSelectedInforme(null);
              setModalOpen(false);
            }}
            disabled={loading}
          >
            Guardar
          </button>
          <button
            className="delete"
            onClick={() => {
              setEditId(null);
              setEditTitle("");
              setEditContent("");
            }}
            disabled={loading}
          >
            Cancelar
          </button>
        </>
      ) : (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {selectedInforme.content}
        </div>
      )}
      <p>
        <strong>Observaciones:</strong>{" "}
        {selectedInforme.observaciones || "-"}
      </p>
      {/* Botones solo para tesorero y si el informe es pendiente u observado */}
      {userRole === "Tesorero" &&
        ["pendiente", "observado"].includes(selectedInforme.estado) &&
        editId !== selectedInforme.id && (
          <div style={{ marginTop: "1em" }}>
            <button
              className="edit"
              onClick={() => {
                setEditId(selectedInforme.id);
                setEditTitle(selectedInforme.title);
                setEditContent(selectedInforme.content);
              }}
            >
              Editar
            </button>
            <button
              className="delete"
              onClick={async () => {
                await handleDeleteInforme(selectedInforme.id);
                setSelectedInforme(null);
                setModalOpen(false);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      {/* Botones solo para presidente y si el informe es pendiente u observado */}
      {userRole === "Presidente" &&
        ["pendiente", "observado"].includes(selectedInforme.estado) && (
          obsId === selectedInforme.id ? (
            <>
              <textarea
                placeholder="Observación"
                value={obsText}
                onChange={(e) => setObsText(e.target.value)}
                disabled={loading}
                rows={3}
                style={{
                  width: "100%",
                  resize: "vertical",
                  fontSize: "1em",
                  padding: "8px",
                  marginBottom: "1em",
                  borderRadius: "4px",
                  border: "1px solid #bdbdbd",
                }}
              />
              <button
                className="edit"
                onClick={async () => {
                  await handleDejarObservacion(selectedInforme.id, obsText);
                  setObsId(null);
                  setObsText("");
                  setSelectedInforme(null);
                  setModalOpen(false);
                }}
                disabled={loading || !obsText}
              >
                Guardar Observación
              </button>
              <button
                className="delete"
                onClick={() => setObsId(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </>
          ) : (
            <div style={{ marginTop: "1em" }}>
              <button
                className="observacion"
                onClick={() => setObsId(selectedInforme.id)}
                disabled={loading}
              >
                Dejar Observación
              </button>
              {!selectedInforme.observaciones && (
                <button
                  className="edit"
                  onClick={async () => {
                    await handleAprobarInforme(selectedInforme.id);
                    setSelectedInforme(null);
                    setModalOpen(false);
                  }}
                  disabled={loading}
                >
                  Aprobar
                </button>
              )}
            </div>
          )
        )}
      {/* Solo mostrar "Cerrar" si NO se está dejando una observación y NO se está editando */}
      {!(
        (userRole === "Presidente" &&
          ["pendiente", "observado"].includes(selectedInforme.estado) &&
          obsId === selectedInforme.id) ||
        (userRole === "Tesorero" && editId === selectedInforme.id)
      ) && (
        <button
          className="delete"
          onClick={handleCloseModal}
          style={{ marginTop: "1em" }}
        >
          Cerrar
        </button>
      )}
    </div>
  </div>
);

export default InformeModalDetalle;