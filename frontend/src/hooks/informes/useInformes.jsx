import { useCallback, useState } from "react";
import {
  getInformes,
  crearInforme,
  editarInforme,
  dejarObservacion,
  aprobarInforme,
} from "@services/informe.service.js";

export function useInformes() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInformes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInformes();
      setInformes(data || []);
    } catch {
      alert("Error al cargar informes");
    }
    setLoading(false);
  }, []);

  const handleCrearInforme = async (title, content) => {
    setLoading(true);
    try {
      await crearInforme({ title, content });
      await fetchInformes();
    } catch (e) {
      alert(e?.response?.data?.message || "Error al crear informe");
    }
    setLoading(false);
  };

  const handleEditarInforme = async (id, title, content) => {
    setLoading(true);
    try {
      await editarInforme(id, { title, content });
      await fetchInformes();
    } catch (e) {
      alert(e?.response?.data?.message || "Error al editar informe");
    }
    setLoading(false);
  };

  const handleDejarObservacion = async (id, observacion) => {
    setLoading(true);
    try {
      await dejarObservacion(id, observacion);
      await fetchInformes();
    } catch (e) {
      alert(e?.response?.data?.message || "Error al dejar observación");
    }
    setLoading(false);
  };

  const handleAprobarInforme = async (id) => {
    setLoading(true);
    try {
      await aprobarInforme(id);
      await fetchInformes();
    } catch (e) {
      alert(e?.response?.data?.message || "Error al aprobar informe");
    }
    setLoading(false);
  };

  return {
    informes,
    setInformes,
    fetchInformes,
    loading,
    handleCrearInforme,
    handleEditarInforme,
    handleDejarObservacion,
    handleAprobarInforme,
  };
}