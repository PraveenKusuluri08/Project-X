import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { onLogin } from "../../middleware/index";
import Presentation from "./Presentation";
function Container(props) {
  const { auth } = props;
  const [password,setPassword]=useState("") 
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onLogin(state);
    setState({
      ...state,
      email: "",
      password: "",
    });
  };
  useEffect(() => {
    const passwordToggler = document.querySelector(".js-password-toggle");
    if (passwordToggler !== null) {
      console.log(passwordToggler);
      passwordToggler.addEventListener("change", () => {
        const password = document.querySelector(".js-password"),
          passwordLabel = document.querySelector(".js-password-label");

        if (password.type === "password") {
          password.type = "text";
          setPassword(password.innerHTML = "Hide")
        } else {
          password.type = "password";
          setPassword(password.innerHTML = "Show")
        }
      });
    }
  }, []);

  return (
    <Presentation
    password={password}
      auth={auth}
      handleChange={handleChange}
      state={state}
      onLogin={props.onLogin}
      handleSubmit={handleSubmit}
    />
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (creds) => dispatch(onLogin(creds)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Container);
