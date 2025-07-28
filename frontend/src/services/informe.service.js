import axios from './root.service.js';

export async function getInformes() {
  const response = await axios.get('/informes');
  return response.data.data;
}

export async function crearInforme({ title, content }) {
  const response = await axios.post('/informes', { title, content });
  return response.data;
}

export async function editarInforme(id, { title, content }) {
  const response = await axios.put(`/informes/${id}`, { title, content });
  return response.data;
}

export async function dejarObservacion(id, observacion) {
  const response = await axios.put(`/informes/${id}/observacion`, { observacion });
  return response.data;
}

export async function aprobarInforme(id) {
  const response = await axios.put(`/informes/${id}/aprobar`);
  return response.data;
}

export async function deleteInforme(id) {
  const response = await axios.delete(`/informes/${id}`);
  return response.data;
}