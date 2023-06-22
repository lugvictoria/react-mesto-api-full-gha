/**
 * Настройки для подключения к серверу
 */
const token = "fc2169ac-40f3-4626-a69d-9bd39655e7bd";
const cohortId = "cohort-60";

export const apiConfig = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${cohortId}`,
  headers: {
    authorization: token,
    "Content-Type": "application/json",
  },
};
