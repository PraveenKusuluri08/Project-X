import { connect } from "react-redux";
import "./App.css";
import Signin from "./Pages/SignIn";
import axios from "axios";
import Navbar from "./Services/DashBoard/Components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App(props) {
  const { auth } = props;
  // console.log("sgdsgsg",props.auth.uid)
  console.log("axios",axios.defaults.headers.common)

  return auth.uid ? (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin/>} />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

export default connect(mapStateToProps)(App);
