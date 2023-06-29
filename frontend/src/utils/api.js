const baseUrl = `https://api.lugvictoria.nomoreparties.sbs`;

  /**
   * Получает данные текущего пользователя
   * @returns {Promise} Промис с ответом сервера: объект текущего пользователя
   */
  export function getUserInfo() {
    const url = `${baseUrl}/users/me`;

    return fetch(url, {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Устанавливает новые имя и профессию текущего пользователя
   * @param {object} Объект с обновляемыми параметрами:
   * - name - имя пользователя
   * - job - профессия пользователя
   * @returns {Promise} Промис с ответом сервера: обновленный объект пользователя
   */
  export function setUserInfo({ name, about }) {
    const url = `${baseUrl}/users/me`;

    return fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Устанавливает новый аватар пользователя
   * @param {string} link - Ссылка на картинку
   * @returns {Promise} Промис с ответом сервера: обновленный объект пользователя
   */
  export function changeAvatar(link) {
    const url = `${baseUrl}/users/me/avatar`;

    return fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Получает исходные карточки для отрисовки
   * @returns {Promise} Промис с ответом сервера: массив карточек
   */
  export function getInitialCards() {
    const url = `${baseUrl}/cards`;

    return fetch(url, {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Добавляет новую карточку
   * @param {object} Параметры добавляемой карточки:
   * - name - отображаемое имя
   * - link - ссылка на добавляемую картинку
   * @returns {Promise} Промис с ответом сервера: объект созданной карточки
   */
  export function addNewCard({ name, link }) {
    const url = `${baseUrl}/cards`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Удаляет карточку с сервера
   * @param {string} cardId - ID карточки
   * @returns {Promise} Промис с ответом сервера
   */
  export function deleteCard(cardId) {
    const url = `${baseUrl}/cards/${cardId}`;

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) return Promise.resolve();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Ставит лайк на карточку
   * @param {string} cardId - ID карточки
   * @returns {Promise} Промис с массивом новых лайков карточки
   */
  function setLike(cardId) {
    const url = `${baseUrl}/cards/${cardId}/likes`;

    return fetch(url, {
      method: "PUT",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Удаляет лайк с карточки
   * @param {string} cardId - ID карточки
   * @returns {Promise} Промис с массивом новых лайков карточки
   */
  function deleteLike(cardId) {
    const url = `${baseUrl}/cards/${cardId}/likes`;

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization" : `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((res) => {
        throw new Error(res.message);
      });
    });
  }

  /**
   * Переключает лайк карточки
   * @param {string} cardId - ID карточки
   * @param {boolean} isLiked - Текущий статус лайка
   * @returns {Promise} Промис с массивом новых лайков карточки
   */
  export function toggleLike(cardId, isLiked) {
    if (isLiked) {
      return deleteLike(cardId);
    } else {
      return setLike(cardId);
    }
  }


