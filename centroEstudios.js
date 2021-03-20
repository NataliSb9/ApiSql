app.use(express.json());
const app = express();
const express = require("express");
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "centroestudios"
})
connection.connect(function(err){
    if(err){
        console.log("Error " + err)
    }else{
        console.log("Te has conectado correctamente a la base de datos.")
    }
})
app.listen(3000)
