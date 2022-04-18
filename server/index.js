const express = require("express");
const app = express();
var cors = require("cors");
const port = 8080;
const mongoose = require("mongoose");
require('dotenv').config();
const jwt = require("jsonwebtoken")
mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })


const Schema = mongoose.Schema;
const user = new Schema({
  uniqueIdentifier: String,
  username: String,
  pwd: String,
  regdate: Date,
  accepting:Boolean,
});
const Userr = mongoose.model("NewUser", user);

app.use(cors());
app.use(express.json());

app.post("/api/createAccount", (req, res) => {
  const { uid } = req.body;
  const { usernameReg } = req.body;
  const { passwordHashed } = req.body;

  Userr.find({ username: `${usernameReg}` }, function (err, data) {
    if (data[0]) {
      res.status(200).send({
        status: "unsuccessful",
      });
    } else if (!data[0]) {
      const newUsers = new Userr({
        uniqueIdentifier: `${uid}`,
        username: `${usernameReg}`,
        pwd: `${passwordHashed}`,
        regdate: Date.now(),
        accepting:true,
      });

      res.status(200).send({
        status: "successful",
        registedID: `${uid}`,
      });
      newUsers.save();
    }
  });
});

app.post('/api/login', (req, res)=>{
  const {username, password} = req.body;
  Userr.find({username: `${username}`, pwd:`${password}`}, (err, data)=>{
    if(data[0]){
      let userObj = {
      username:`${data[0].username}`,
      password:`${data[0].pwd}`
    }
      res.status(200).send({
      status: "login successful",
      uid: `${data[0].uniqueIdentifier}`,
      accesstoken: `${jwt.sign(userObj, process.env.ACCESS_SECRET)}`
      })
    }else if(!data[0]){
      res.status(200).send({
        status:`login unsuccessful`,
      })
    }
  })
});

app.get('/api/getMsgs', (req, res)=>{
    jwt.verify(req.headers['x-auth-token'],process.env.ACCESS_SECRET,(err,decoded)=>{
      if(err){
        res.status(401);
      }else if(decoded){
        Userr.find({username:decoded.username,pwd:decoded.password},(err,data)=>{
          if(data[0]){
            res.status(200).send(data[0].chats);
          }else if(!data[0]){
            res.status(404).send("account not found")
          }
        })
      }
    })
});

app.post('/api/createChat',(req,res)=>{
    const {user} = req.body;
    Userr.find({uniqueIdentifier:`${user}`},(err,data)=>{
        if(data[0]){
          data[0].accepting ? res.status(200).send({status:'success'}) : res.staus(200).send({status:'failure'});
        }else if(!data[0]){
          res.status(200).send({status:'failure'});
        }
    })
})

app.listen(port);
