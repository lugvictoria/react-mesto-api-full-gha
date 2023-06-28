/**
 * Настройки для подключения к серверу
 */

export const apiConfig = {
  // baseUrl: `http://localhost:3000`,
  baseUrl: `https://api.lugvictoria.nomoreparties.sbs`, 
  headers: {
    "Authorization" : `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};
