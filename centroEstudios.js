const express = require("express");
const app = express();
app.use(express.json());

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

app.get("/estudiante", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let querytu=`SELECT first_name, last_name, entryDate
        FROM students
        WHERE student_id=?`
        connection.query(querytu,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let querytu=
        `SELECT first_name, last_name, entryDate
        FROM students`
        connection.query(querytu,function (err,resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})

app.post("/estudiante",function(req,res){
    let insert = "INSERT INTO students(first_name,last_name, group_id, entryDate) VALUES (?,?,?,?)"
    connection.query(insert,[req.body.first_name, req.body.last_name,req.body.group_id, req.body.entryDate],function(err,resultado,field){
        if (err) throw err;
        res.send(`Se ha creado un nuevo estudiantes con id: ${resultado.insertId} en la base de datos students`);
    })
})

/*app.put("/estudiante",function(req,res){
    let id = req.body.student_id
    let update = 
    `UPDATE students
    SET first_name = ?, last_name= ?, group_id=?, entryDate = ?
    WHERE student_id = ?;`
    connection.query(update,[id,req.body.first_name, req.body.last_name,req.body.group_id, req.body.entryDate],function(err,resultado,field){
        if (err) throw err;
        res.send(resultado);
    })
})*/
/*
app.delete("/estudiante",function(req,res){
    let id = req.body.student_id
    let deleteStu=
    `DELETE
    FROM students
    WHERE student_id=?`
    connection.query(deleteStu,[id],function (err, resultado,field) {
        if (err) throw err;
        res.send(resultado);
    });
})
 */
//PROFES

app.get("/profesores", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let querytu=`SELECT first_name, last_name
        FROM teachers
        WHERE idTeacher=?`
        connection.query(querytu,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let querytu=
        `SELECT first_name, last_name
        FROM teachers`
        connection.query(querytu,function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})

app.post("/profesores",function(req,res){
    let insert = "INSERT INTO teachers (first_name, last_name) VALUES (?,?)"
    connection.query(insert,[req.body.first_name, req.body.last_name],function(err,resultado,field){
        if (err) throw err;
        res.send(`Se ha creado un nuevo profesor/a con id: ${resultado.insertId} en la base de datos teachers`);
    })
})

//Grupo

app.get("/grupos", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT name
        FROM groups
        WHERE group_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let query=
        `SELECT name
        FROM groups`
        connection.query(query,function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})

app.post("/grupos",function(req,res){
    let insert = "INSERT INTO groups (name) VALUES (?)"
    connection.query(insert,[req.body.name],function(err,resultado,field){
        if (err) throw err;
        res.send(`Se ha creado un nuevo grupo con id: ${resultado.insertId} en la base de datos grupos`);
    })
})

//Asignatura

app.get("/asignatura", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT title
        FROM subjects
        WHERE subject_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let query=
        `SELECT title
        FROM subjects`
        connection.query(query,function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})

app.post("/asignatura",function(req,res){
    let insert = "INSERT INTO subjects (title) VALUES (?)"
    connection.query(insert,[req.body.title],function(err,resultado,field){
        if (err) throw err;
        res.send(`Se ha creado una nueva asignatura con id: ${resultado.insertId} en la base de datos de subjects`);
    })
})

//Notas

app.get("/notas", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT mark
        FROM marks
        WHERE student_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        res.send('No has introducido el id del estudiante para poder ver las notas')
    }
})

app.post("/notas",function(req,res){
    let insert = "INSERT INTO marks (student_id,subject_id,date,mark) VALUES (?,?,?,?)"
    connection.query(insert,[req.body.student_id, req.body.subject_id, req.body.date, req.body.mark],function(err,resultado,field){
        if (err) throw err;
        res.send(`Se ha introducido una nueva nota con id: ${resultado.insertId} en la base de datos marks`);
    })
})

//GET ADICIONAL
app.get("/media", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT AVG(mark)
        FROM marks
        WHERE student_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send("La media del estudiante indicado es "+ JSON.stringify(resultado));
        });
    }else{
        res.send('No has introducido el id del estudiante para poder conocer la media')
    }
})

app.get("/apuntadas", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT subjects.title
        FROM marks
        INNER JOIN students ON(marks.student_id=students.student_id)
        INNER JOIN  subjects ON (marks.subject_id= subjects.subject_id)
        WHERE students.student_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let querytu=
        `SELECT subjects.title, students.first_name,students.last_name
        FROM marks
        INNER JOIN students ON(marks.student_id=students.student_id)
        INNER JOIN  subjects ON (marks.subject_id= subjects.subject_id)`
        connection.query(querytu,function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})
app.get("/impartidas", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT subjects.title, teachers.first_name,teachers.last_name
        FROM subject_teacher
        INNER JOIN subjects ON (subjects.subject_id= subject_teacher.subject_Id)
        INNER JOIN teachers ON (teachers.idTeacher= subject_teacher.idTeacher)
        WHERE subject_teacher.idTeacher=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let querytu=
        `SELECT subjects.title, teachers.first_name,teachers.last_name
        FROM subject_teacher
        INNER JOIN subjects ON (subjects.subject_id= subject_teacher.subject_Id)
        INNER JOIN teachers ON (teachers.idTeacher= subject_teacher.idTeacher)`
        connection.query(querytu,function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        })
    }
})
app.listen(3000)


