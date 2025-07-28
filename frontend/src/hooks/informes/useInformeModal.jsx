import { useState } from "react";

export function useInformeModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [obsId, setObsId] = useState(null);
  const [obsText, setObsText] = useState("");

  const openCreateModal = () => {
    setSelectedInforme(null);
    setModalOpen(true);
  };

  const handleExpand = (informe) => {
    setSelectedInforme(informe);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInforme(null);
    setTitle("");
    setContent("");
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setObsId(null);
    setObsText("");
  };

  return {
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
  };
}

export default useInformeModal;