import axios from '@services/root.service.js';

export async function getAsambleas() {
  try {
    const response = await axios.get('/asambleas');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener asambleas:', error);
    throw error;
  }
}

export async function getAsambleaById(id) {
  try {
    const response = await axios.get(`/asambleas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la asamblea:', error);
    throw error;
  }
}

export async function postAsambleas(asambleaData) {
  try {
    const response = await axios.post('/asambleas', asambleaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear asamblea:', error);
    throw error;
  }
}

export async function updateAsamblea(id, asambleaData) {
  try {
    const response = await axios.put(`/asambleas/${id}`, asambleaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar asamblea:', error);
    throw error;
  }
}

export async function deleteAsamblea(id) {
  try {
    const response = await axios.delete(`/asambleas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar asamblea:', error);
    throw error;
  }
}

// Aprueba una asamblea (cambia estado a "aprobada")
export async function aprobarAsamblea(id) {
  try {
    const response = await axios.put(`/asambleas/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error('Error al aprobar asamblea:', error);
    throw error;
  }
}

// Rechaza una asamblea con observación (cambia estado a "observada")
export async function rechazarAsamblea(id, observacion) {
  try {
    const response = await axios.put(`/asambleas/${id}/rechazar`, { observacion });
    return response.data;
  } catch (error) {
    console.error('Error al rechazar asamblea:', error);
    throw error;
  }
}