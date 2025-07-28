import React from "react";

const InformesTable = ({ informes, onExpand }) => (
  <table className="informes-table">
    <thead>
      <tr>
        <th className="text-left">Título</th>
        <th className="text-left">Fecha</th>
        <th className="text-left">Estado</th>
        <th className="text-left">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {informes.map((informe) => (
        <tr key={informe.id}>
          <td>{informe.title}</td>
          <td>
            {informe.createdAt
              ? new Date(informe.createdAt).toLocaleDateString()
              : "-"}
          </td>
          <td>{informe.estado}</td>
          <td>
            <button
              className="edit"
              onClick={() => onExpand(informe)}
            >
              Expandir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InformesTable;