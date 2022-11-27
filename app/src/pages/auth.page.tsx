import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth.form";
import { useAppSelector } from "../hooks/redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    if (uid && uid.length > 0) {
      navigate("/home");
    }
  }, [uid]);

  return (
    <div className="auth">
      <AuthForm form={"login"} />
    </div>
  );
};

export default LoginPage;
