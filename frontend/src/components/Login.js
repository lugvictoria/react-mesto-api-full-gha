import React from 'react';
import {Link} from 'react-router-dom';

import Header from './Header';

function Login({onSubmit}) {
  const [inputs, setInputs] = React.useState({
    email: '',
    password: '',
  });

  function handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    setInputs(state => ({...state, [name]: value}));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(inputs);
  }
  return (
    <>
      <Header>
        <Link to="/sign-up" className="header__menu-item">Регистрация</Link>
      </Header>

      <main>
        <div className="login content__element">
          <h2 className="login__title">Вход</h2>
          <form className="login__form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="login__input"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="login__input"
              placeholder="Пароль"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              required
            />
            <button rype="submit" className="login__submit-button">Войти</button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;