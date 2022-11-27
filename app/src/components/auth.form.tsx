import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../hooks/redux";
import AuthService from "../services/auth.service";
import { userSlice } from "../store/reducers/user.slice";
import AppLoader from "./app.loader";

/**
 * Форма авторизации
 * @param props.form Тип формы: Regin/Login
 */
const AuthForm = (props: { form: string }) => {
  const [form, setForm] = useState(props.form);
  const [uid, setUid] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bad, setBad] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * Переключение формы
   * @param {string} to тип формы
   * @returns {void}
   */
  const handleSetForm = (to: string): void => {
    setInvalid(false);
    setUid("");
    setBad("");

    if (to !== "login") {
      setUid(uuidv4());
    }

    setForm(to);
  };

  /**
   * В случае ошибки валидации input элемент получит класс для стилизации.
   * @returns {string}
   */
  const input_isInvalid = (): string => {
    if (invalid) {
      return "invalid";
    } else {
      return "";
    }
  };

  /**
   * Рендер плохого ответа с сервера
   * @returns {JSX.Element|null}
   */
  const bad_request = (): JSX.Element | null => {
    if (bad && bad.length > 0) {
      return (
        <div className="mt-30">
          <small className="error">{bad}</small>
        </div>
      );
    } else {
      return null;
    }
  };

  /**
   * Обработка формы логина и отправка запроса на сервер
   * @param e Событие нажатия на кнопку
   * @returns {Promise<void>}
   */
  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setInvalid(false);

    if (uid.length <= 0) {
      setInvalid(true);
      setLoading(false);
      return;
    }

    const { status, message } = await AuthService.login(uid);
    if (status !== 200) {
      setBad(message);
    } else {
      dispatch(userSlice.actions.setUid(uid));
      navigate("/home");
    }

    setLoading(false);
  };

  /**
   * Обработка формы регистрации и отправка запроса на сервер
   * @param e Событие нажатия на кнопку
   * @returns {Promise<void>}
   */
  const handleRegin = async (e: any): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setBad("");

    const { status, message } = await AuthService.regin(uid);
    if (status !== 201) {
      setBad(message);
    } else {
      dispatch(userSlice.actions.setUid(uid));
      navigate("/home");
      return;
    }

    setLoading(false);
  };

  if (!loading && form === "login") {
    return (
      <form className="auth_form">
        <div className="form-controlls">
          <h2 className="auth-heading">ToDo List</h2>

          <div className="form-controll mt-30">
            <input
              className={input_isInvalid()}
              type="text"
              placeholder="Please enter your UID"
              onChange={(e) => setUid(e.target.value)}
              key={1}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="action"
            type="submit"
            onClick={(e) => handleLogin(e)}
          >
            Enter
          </button>

          <div className="sub-action" onClick={() => handleSetForm("regin")}>
            Get account
          </div>
        </div>

        {bad_request()}
      </form>
    );
  } else if (!loading && form === "regin") {
    return (
      <form className="auth_form">
        <div className="form-controlls">
          <h2 className="auth-heading">ToDo List</h2>

          <div className="form-controll mt-30">
            <input type="text" readOnly value={uid} key={0} />
            <div className="description">Please remember your id!</div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="action"
            type="submit"
            onClick={(e) => handleRegin(e)}
          >
            Enter
          </button>

          <div className="sub-action" onClick={() => handleSetForm("login")}>
            Login
          </div>
        </div>

        {bad_request()}
      </form>
    );
  } else {
    return (
      <form className="auth_form">
        <AppLoader />
      </form>
    );
  }
};

export default AuthForm;
