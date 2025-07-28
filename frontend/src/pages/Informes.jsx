import React, { useEffect } from "react";
import { useInformes } from "@hooks/informes/useInformes.jsx";
import useDeleteInforme from "@hooks/informes/useDeleteInforme.jsx";
import useEditInforme from "@hooks/informes/useEditInforme.jsx";
import useInformeNotification from "@hooks/informes/useInformeNotification.jsx";
import useInformeModal from "@hooks/informes/useInformeModal.jsx";
import InformeModalDetalle from "@components/InformeModalDetalle.jsx";
import InformeModalCrear from "@components/InformeModalCrear.jsx";
import InformesTable from "@components/InformeTable.jsx";
import "@styles/informes.css";

// Página principal para la gestión de informes financieros
const Informes = () => {
  // Se obtiene el usuario actual desde sessionStorage
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.role;

  // Hook personalizado para manejar el estado y acciones de los modales y formularios
  const {
    modalOpen,
    setModalOpen,
    selectedInforme,
    setSelectedInforme,
    openCreateModal,
    handleExpand,
    handleCloseModal,
    title,
    setTitle,
    content,
    setContent,
    editId,
    setEditId,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    obsId,
    setObsId,
    obsText,
    setObsText,
  } = useInformeModal();

  // Hook para manejar la obtención y acciones sobre los informes
  const {
    informes,
    fetchInformes,
    loading,
    handleCrearInforme,
    handleDejarObservacion,
    handleAprobarInforme,
  } = useInformes();

  // Hook para eliminar informes
  const { handleDeleteInforme } = useDeleteInforme(fetchInformes);

  // Hook para editar informes
  const { handleEditInforme } = useEditInforme(fetchInformes);

  // Al cargar el componente, se obtienen los informes
  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  // Notifica al tesorero si hay informes observados
  useInformeNotification(userRole, informes);

  // Maneja el envío del formulario para crear un nuevo informe
  const onCrearInforme = async (e) => {
    e.preventDefault();
    await handleCrearInforme(title, content);
    setTitle("");
    setContent("");
    setModalOpen(false);
  };

  return (
    <div className="informes-page">
      <h2>Informes Financieros</h2>
      {/* Solo el tesorero puede ver el botón para crear informes */}
      {userRole === "Tesorero" && (
        <button
          className="edit informes-create-btn"
          onClick={openCreateModal}
        >
          Crear Informe
        </button>
      )}
      {/* Tabla de informes */}
      <InformesTable informes={informes} onExpand={handleExpand} />

      {/* Modal para ver detalles y acciones sobre un informe */}
      {modalOpen && selectedInforme && (
        <InformeModalDetalle
          userRole={userRole}
          selectedInforme={selectedInforme}
          editId={editId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editContent={editContent}
          setEditContent={setEditContent}
          loading={loading}
          handleEditInforme={handleEditInforme}
          setEditId={setEditId}
          setEditContent={setEditContent}
          setSelectedInforme={setSelectedInforme}
          setModalOpen={setModalOpen}
          handleDeleteInforme={handleDeleteInforme}
          obsId={obsId}
          obsText={obsText}
          setObsId={setObsId}
          setObsText={setObsText}
          handleDejarObservacion={handleDejarObservacion}
          handleAprobarInforme={handleAprobarInforme}
          handleCloseModal={handleCloseModal}
        />
      )}

      {/* Modal para crear un nuevo informe */}
      {modalOpen && !selectedInforme && (
        <InformeModalCrear
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          loading={loading}
          onCrearInforme={onCrearInforme}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Informes;