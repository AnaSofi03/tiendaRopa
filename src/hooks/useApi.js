import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

// 🔹 GET - Hook personalizado
export function useFetch(endpoint) {
  const [data, setData] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const reload = () => setReloadTrigger((prev) => prev + 1);

  useEffect(() => {
    axios
      .get(`${API_URL}/${endpoint}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error al obtener datos:", err));
  }, [endpoint, reloadTrigger]);

  return [data, reload];
}
// 🔹 GET genérico - útil para consultas con query params
export async function fetchData(endpoint) {
  try {
    const res = await axios.get(`${API_URL}/${endpoint}`);
    return res.data;
  } catch (error) {
    console.error("Error en fetchData:", error.response?.data || error.message);
    throw error;
  }
}

// 🔹 POST - Crear nuevo recurso
export async function postData(endpoint, data) {
  try {
    const res = await axios.post(`${API_URL}/${endpoint}`, data);
    return res.data;
  } catch (error) {
    console.error("Error en POST:", error);
    throw error;
  }
}

// 🔹 PUT - Actualizar recurso existente
export async function updateData(endpoint, id, data) {
  try {
    const res = await axios.put(`${API_URL}/${endpoint}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

// 🔹 DELETE - Eliminar recurso
export async function deleteData(endpoint, id) {
  try {
    const res = await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}



