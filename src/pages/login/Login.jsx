/* eslint-disable react/react-in-jsx-scope */
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log("Full response data:", res.data);

      if (res.data.isAdmin) {
        // Save the token in localStorage
        localStorage.setItem("token", res.data.token);

        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/");
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not allowed!" },
        });
      }
    } catch (err) {
      let errorMessage = "Network error";
      if (err.response) {
        errorMessage = err.response.data.error || err.response.data.message || "Login failed. Please try again.";
      }
      dispatch({ type: "LOGIN_FAILURE", payload: { message: errorMessage } });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
