import { Form, Button, Modal, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import Loggedin from "./loggedin";
const md5 = require("md5");
const axios = require("axios");
let idGen = uuidv4();

function App() {
  const [takenError, setTakenError] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [toast, settoast] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [login, setLogin] = useState(false)
  const showt = () => settoast(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loggedin, setLoggedin] = useState(false);
  if (loggedin) {
    return(<Loggedin token={window.localStorage.getItem('auth-token')}></Loggedin>);
  } else if (!loggedin) {
    return (
      <>
        <div
          style={{
            width: "30vw",
            marginLeft: "35vw",
            marginTop: "25vh",
            padding: "2vw",
            borderRadius: "3%",
            backgroundColor: "#e9ecef",
          }}
        >
          <h1>React-Chat-App</h1>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter Username"
                value={loginUsername}
                onChange={(e) => {
                  setLoginUsername(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                }}
              />
            </Form.Group>
            <Button variant="success" type="submit" onClick={(e)=>{
              e.preventDefault();
              if(loginUsername.length < 3 ||
                loginUsername.length > 21 ||
                loginPassword.length < 3 ||
                loginPassword.length > 21){
                  showt();
                }else if(
                  !loginUsername.length < 3 ||
                  loginUsername.length > 21 ||
                  loginPassword.length < 3 ||
                  loginPassword.length > 21){
                    axios.post('http://localhost:8080/api/login',{
                      username:`${loginUsername}`,
                      password:`${md5(loginPassword)}`,
                    }).then((res)=>{
                      if(res.data.status === 'login successful'){
                        let {accesstoken} = res.data;
                        window.localStorage.setItem('auth-token',`${accesstoken}`);
                        setLoggedin(true)
                      }else if(res.data.status === 'login unsuccessful'){
                        console.log('login credentials are invalid')
                        setInvalidLogin(true)
                      }
                    })
                  }
            }}>
              Login
            </Button>
            <Button
              variant="secondary"
              type="submit"
              style={{ marginLeft: "0.5vh" }}
              onClick={(e) => {
                e.preventDefault();
                handleShow();
              }}
            >
              Create account
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>Create account</Modal.Body>
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{
                  marginLeft: "1vw",
                  width: "25vw",
                  marginBottom: "1vw",
                }}
                value={username}
                onChange={(e) => {
                  e.preventDefault();
                  setUsername(e.target.value);
                }}
              ></input>
              <Form.Group
                controlId="formBasicPassword"
                style={{
                  marginLeft: "1vw",
                  width: "25vw",
                  marginBottom: "1vw",
                }}
                type={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Modal.Footer id="er">
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      username.length < 3 ||
                      username.length > 21 ||
                      password.length < 3 ||
                      password.length > 21
                    ) {
                      showt();
                    } else if (
                      !username.length < 3 ||
                      username.length > 21 ||
                      password.length < 3 ||
                      password.length > 21
                    ) {
                      axios
                        .post("http://localhost:8080/api/createAccount", {
                          uid: `${idGen}`,
                          usernameReg: `${username}`,
                          passwordHashed: `${md5(password)}`,
                        })
                        .then(function (response) {
                          if (response.data.status === "unsuccessful") {
                            console.log("account already taken");
                            setTakenError(true);
                          } else if (response.data.status === "successful") {
                            handleClose();
                            setLogin(true);
                          }
                        })
                        .catch(function (error) {
                          setError(true);
                        });
                    }
                  }}
                >
                  Create Account
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        </div>
        <Alert
          show={toast}
          variant="danger"
          style={{ width: "30vw", marginLeft: "0.5vw" }}
          onClose={() => {
            settoast(false);
          }}
          dismissible
        >
          Username and password must be between 2-20 characters.
        </Alert>

        <Alert
          show={error}
          variant="danger"
          style={{ width: "30vw", marginLeft: "0.5vw" }}
          onClose={() => {
            setError(false);
          }}
          dismissible
        >
          An unexpected error has occured. please try again later
        </Alert>

        <Alert
          show={takenError}
          variant="danger"
          style={{ width: "30vw", marginLeft: "0.5vw" }}
          onClose={() => {
            setTakenError(false);
          }}
          dismissible
        >
          account already taken
        </Alert>

        <Alert
          show={invalidLogin}
          variant="danger"
          style={{ width: "30vw", marginLeft: "0.5vw" }}
          dismissible
          onClose={() => {
            setInvalidLogin(false);
          }}
        >
          Invalid Login Credentials
        </Alert>

        <Alert
          show={login}
          variant="success"
          style={{ width: "30vw", marginLeft: "0.5vw" }}
          onClose={() => {
            setLogin(false);
          }}
          dismissible
        >
          Account registered successfully! please login
        </Alert>

      </>
    );
  }
}

export default App;
