/**
 * Настройки для подключения к серверу
 */

export const apiConfig = {
  baseUrl: `http://localhost:3000`,
  headers: {
    "Authorization" : `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};
