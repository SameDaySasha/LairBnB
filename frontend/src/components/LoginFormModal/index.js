import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "Smaug", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-form-modal">
      <h1 className="login-form-modal__title">Log In</h1>
      <form className="login-form-modal__form" onSubmit={handleSubmit}>
        <label className="login-form-modal__label">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="login-form-modal__input"
          />
        </label>
        <label className="login-form-modal__label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-form-modal__input"
          />
        </label>
        {errors.credential && (
          <p className="login-form-modal__error">{errors.credential}</p>
        )}
        <button type="submit" className="login-form-modal__button" disabled={credential.length < 4 || password.length < 6}>Log In</button>
        <button onClick={handleDemoLogin} className="login-form-modal__button login-form-modal__button--demo">Log in as Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
