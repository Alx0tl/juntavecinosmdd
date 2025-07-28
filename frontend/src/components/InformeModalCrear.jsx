import React from "react";

const InformeModalCrear = ({
  title,
  setTitle,
  content,
  setContent,
  loading,
  onCrearInforme,
  handleCloseModal,
}) => (
  <div className="modal-overlay" onClick={handleCloseModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Crear Informe</h3>
      <form onSubmit={onCrearInforme}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          style={{ marginBottom: "1em" }}
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
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
        <button type="submit" className="edit" disabled={loading}>
          Guardar
        </button>
        <button
          type="button"
          className="delete"
          onClick={handleCloseModal}
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
);

export default InformeModalCrear;