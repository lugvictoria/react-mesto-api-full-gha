import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmActionPopup from "./ConfirmActionPopup";
import InfoPopup from "./InfoPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import CurrentUserContext from "../contexts/CurrentUserContext";
import auth from "../utils/auth";
import { toggleLike, deleteCard, addNewCard, getInitialCards, changeAvatar, setUserInfo, getUserInfo  } from "../utils/api";

function App() {
  // Состояние попапов
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  // Данные для обработки попапами
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [toBeDeletedCard, setToBeDeletedCard] = React.useState(null);
  const [infoMessage, setInfoMessage] = React.useState(null);

  // Пользователь
  const [currentUser, setCurrentUser] = React.useState({});
  // Карточки
  const [cards, setCards] = React.useState([]);
  // Авторизация пользователя
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();
  
  /**
   * Получение информации о пользователе и исходных карточек при открытии страницы
   */
  React.useEffect(() => {
      if (isLoggedIn) {
        
        getUserInfo().then(setCurrentUser).catch(console.error);
    
        
          getInitialCards()
          .then((res) => {
            setCards(res.reverse());
          })
          .catch(console.error);  
  }}, [isLoggedIn]);

    // Авторизация
    React.useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        auth
          .checkToken(token)
          .then((res) => {
            setIsLoggedIn(true);
            navigate("/");
            setEmail(res.email);
          })
          .catch(console.error);
      }
    }, []);

  // Функции открытия/закрытия попапов
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setToBeDeletedCard(null);
    setInfoMessage(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleShowInfoMessage(message) {
    setInfoMessage(message);
  }

  // Функции с изменением/обновлением данных на странице
  function handleUpdateUser(userInfo) {
    setUserInfo(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateAvatar({ avatar }) {
      changeAvatar(avatar)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((person) => person === currentUser._id);
      toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch(console.error);
  }

  function handleAddPlace(newPlaceData) {
      addNewCard(newPlaceData)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleCardDelete(card) {
    setToBeDeletedCard(card);
  }

  function handleConfirmDelete() {
    const cardId = toBeDeletedCard._id;
      deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
        closeAllPopups();
      })
      .catch(console.error);
  }



  function handleLogin() {
    setIsLoggedIn(true);
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div classNamecontent="">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggiedIn={isLoggedIn}>
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  email={email}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sign-up"
            element={<Register handleShowInfoMessage={handleShowInfoMessage} />}
          />

          <Route
            path="/sign-in"
            element={
              <Login
                handleShowInfoMessage={handleShowInfoMessage}
                onLogin={handleLogin}
                setEmail={setEmail}
              />
            }
          />

          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        <Footer />

        {/* Попапы */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
        />

        <ConfirmActionPopup
          isOpen={!!toBeDeletedCard}
          onClose={closeAllPopups}
          onConfirm={handleConfirmDelete}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoPopup message={infoMessage} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
