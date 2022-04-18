import {Button,Modal,Alert} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
const axios = require("axios");

function getMsgsarray(token){
    let config = {
        url:'http://localhost:8080/api/getMsgs/',
        method:'get',
        headers:{'X-Auth-Token':`${token}`},
    };
    axios.request(config).then((response,err)=>{
        if(err){
            console.log(err);
        }if(response){
            console.log(response.data)
        }
    });
}

function Loggedin(props){
    const [createChat, setCreateChat] = useState(false);
    const [uid, setUid] = useState("");
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const handleClose = () => setCreateChat(false);
    getMsgsarray(props.token);
    return (
    <>
        <div className="create chats">
            <Button variant="primary" type="submit" size="sm" onClick={(e)=>{
                e.preventDefault();
                setCreateChat(true);
            }}>Create A Chat</Button>
        </div>

        <Modal show={createChat} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create A Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <input
                type="text"
                class="form-control"
                placeholder="UID(Unique Identifier)"
                aria-label="Username"
                aria-describedby="basic-addon1"
                style={{
                  marginLeft: "1vw",
                  width: "25vw",
                  marginBottom: "1vw",
                }}
                value={uid}
                onChange={(e) => {
                  e.preventDefault();
                  setUid(e.target.value);
                }}
              ></input>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={(e)=>{
                    e.preventDefault();
                    const createChatConfig = {
                        url:'http://localhost:8080/api/createChat/',
                        method:'post',
                        headers:{
                            'X-Auth-Token':`${window.localStorage.getItem('auth-token')}`
                        },
                        data:{
                            user:`${uid}`,
                        },
                    };
                    axios.request(createChatConfig).then((response,err)=>{
                        if(response.data.status === 'success'){
                            setSuccess(true);
                            setInterval(() => {
                                setSuccess(false);
                            }, 3000);
                        }else if(response.data.status === 'failure'){
                            setFailure(true);
                            setInterval(() => {
                                setFailure(false);
                            }, 3000);
                        }
                        setCreateChat(false); 
                    })
                }}>Send request</Button>
            </Modal.Footer>
        </Modal>

        <Alert show={success} variant="success"onClose={()=>{
            setSuccess(false);
        }} dissimble>Chat has been created with {uid}</Alert>
        <Alert show={failure} variant="danger" onClose={()=>{
            setFailure(false);
        }} dissimble>Username provided is invalid or user is not accepting requests at the moment. Please try again later</Alert>
    </>
    );

}

export default Loggedin;