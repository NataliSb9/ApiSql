const { json } = require("body-parser");
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


class UpdateColumn {
    constructor(column, valueColumn){
        this.column= column
        this.valueColumn = valueColumn
    }
}

app.get("/estudiante", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let querytu=`SELECT student_id,first_name, last_name, entryDate
        FROM students
        WHERE student_id=?`
        connection.query(querytu,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(resultado);
        });
    }else{
        let querytu=
        `SELECT student_id,first_name, last_name, entryDate
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

app.put("/estudiante",function(req,res){
    let studentId = req.body.student_id;
    let lastName = req.body.last_name;
    let firstName = req.body.first_name
    let entryDate = req.body.entrydate
    let lista = []
    if(studentId !== undefined){
        if(firstName !== undefined){
            let studentFirstName = new UpdateColumn("first_name", firstName)
            lista.push(studentFirstName)
        }
        if(lastName!== undefined){
            let studentLastName = new UpdateColumn("last_name", lastName)
            lista.push(studentLastName)
        }
        if(entryDate !== undefined){
            let dateStu = new UpdateColumn("entrydate", entryDate)
            lista.push(dateStu)
        }
        let params = [];
        let part1 = "UPDATE students SET ";
        let part2 = "";
        for (let i = 0; i < lista.length; i++) {
          if (i === lista.length - 1) {
            part2 += lista[i].column + "=? ";
          } else {
            part2 += lista[i].column + "=?, ";
          }
          params.push(lista[i].valueColumn);
        }
        params.push(studentId);
        let part3 = "WHERE student_id =?";
        let updateStudents = part1+part2+part3

        connection.query(updateStudents,params,function(err,resultado,field){
            if (err) throw err;
            resultado.message = `Los datos del estudiante con el id ${studentId} han sido actualizados`
            res.send(resultado.message);
        })

    }else{
        res.send("No has introducido el id del estudiante.")
    }
    
})

app.delete("/estudiante",function(req,res){
    let id = req.body.student_id
    let deleteStu=
    `DELETE
    FROM students
    WHERE student_id=?`
    connection.query(deleteStu,[id],function (err, resultado,field) {
        if (err) throw err;
        resultado.message = `Se ha eliminado correctamente el  alumno con el id: ${id}`
        res.send(resultado.message);
    });
})

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


app.put("/profesores",function(req,res){
    let idTeacher = req.body.idTeacher ;  
    let lastName = req.body.last_name;
    let firstName = req.body.first_name
    let lista = []
    if(idTeacher !== undefined){
        if(firstName !== undefined){
            let teacherFirstName = new UpdateColumn("first_name", firstName)
            lista.push(teacherFirstName)
        }
        if(lastName!== undefined){
            let teacherLastName = new UpdateColumn("last_name", lastName)
            lista.push(teacherLastName)
        }
       
        let params = [];
        let part1 = "UPDATE teachers SET ";
        let part2 = "";
        for (let i = 0; i < lista.length; i++) {
          if (i === lista.length - 1) {
            part2 += lista[i].column + "=? ";
          } else {
            part2 += lista[i].column + "=?, ";
          }
          params.push(lista[i].valueColumn);
        }
        params.push(idTeacher);
        let part3 = "WHERE idTeacher =?";
        let updateTeacher = part1+part2+part3

        connection.query(updateTeacher,params,function(err,resultado,field){
            if (err) throw err;
            resultado.message = `Los datos del profesor con el id ${idTeacher} han sido actualizados`
            res.send(resultado.message);
        })

    }else{
        res.send("No has introducido el id del profesor.")
    }
    
})

app.delete("/profesores",function(req,res){
    let id = req.body.idTeacher
    let deleteTeacher=
    `DELETE
    FROM teachers
    WHERE idTeacher=?`
    connection.query(deleteTeacher,[id],function (err, resultado,field) {
        if (err) throw err;
        resultado.message = `Se ha eliminado correctamente el profesor con el id: ${id}`
        res.send(resultado.message);
    });
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

app.put("/grupos", function (req, res) {
  let id = req.body.group_id;
  let nameGrupo = req.body.name
  if (id !== undefined && nameGrupo !== undefined) {

    let updateGrupo = new UpdateColumn("name",nameGrupo)
    let update = `UPDATE groups
    SET ${updateGrupo.column} = ?
    WHERE group_id=?`;
    connection.query(
      update,
      [updateGrupo.valueColumn, id],
      function (err, resultado, field) {
        if (err) throw err;
        resultado.message = `El grupo con el id ${id} ha sido actualizado`;
        res.send(resultado.message);
      }
    );
  } else {
    res.send(`No has introducido un grupo para actualizar`);
  }
});

app.delete("/grupos",function(req,res){
    let id = req.body.group_id
    let deleteGroup=
    `DELETE
    FROM groups
    WHERE group_id=?`
    connection.query(deleteGroup,[id],function (err, resultado,field) {
        if (err) throw err;
        resultado.message = `Se ha eliminado correctamente el grupo con el id: ${id}`
        res.send(resultado.message);
    });
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

app.put("/asignatura",function(req,res){
    let id = req.body.subject_id
    let titleValue = req.body.title
    if(id !== undefined && titleValue !== undefined){
        let updateSubject = new UpdateColumn("title",titleValue)
        let updateQuery =`UPDATE subjects
        SET ${updateSubject.column} = ?
        WHERE subject_id=?`
        connection.query(updateQuery,[updateSubject.valueColumn,id],function(err,resultado,field){
            if (err) throw err;
            resultado.message = `La asignatura con el id ${id} ha sido actualizada`
            res.send(resultado.message);
        })
    }else{
        res.send("No has indicado la informacion de la asignatura que quieres cambiar")
    }
   
})
app.delete("/asignatura",function(req,res){
    let id = req.body.subject_id
    let deleteSubject=
    `DELETE
    FROM subjects
    WHERE subject_id=?`
    connection.query(deleteSubject,[id],function (err, resultado,field) {
        if (err) throw err;
        resultado.message = `Se ha eliminado correctamente la asignatura con el id: ${id}`
        res.send(resultado.message);
    });
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

app.put("/notas",function(req,res){
    let studentId = req.body.student_id;
    let subjectId = req.body.subject_id
    let date = req.body.date
    let mark = req.body.mark
    let idMark = req.body.mark_id
    let lista = []
    if(idMark !== undefined){
        if(studentId !== undefined){
            let student = new UpdateColumn("student_id", studentId)
            lista.push(student)
        }
        if(subjectId!== undefined){
            let subjectMark = new UpdateColumn("subject_id", subjectId)
            lista.push(subjectMark)

        }
        if(date !== undefined){
            let dateMark = new UpdateColumn("date", date)
            lista.push(dateMark)

        }
        if(mark !== undefined){
            let markNumber = new UpdateColumn("mark", mark)
            lista.push(markNumber)
        }
        let params = [];
        let part1 = "UPDATE marks SET ";
        let part2 = "";
        for (let i = 0; i < lista.length; i++) {
          if (i === lista.length - 1) {
            part2 += lista[i].column + "=? ";
          } else {
            part2 += lista[i].column + "=?, ";
          }
          params.push(lista[i].valueColumn);
        }
        params.push(idMark);
        let part3 = "WHERE mark_id =?";
        let updateMark = part1+part2+part3

        connection.query(updateMark,params,function(err,resultado,field){
            if (err) throw err;
            resultado.message = `Los datos de la nota con el id ${idMark} han sido actualizados`
            res.send(resultado.message);
        })

    }else{
        res.send("No has introducido el id de la nota.")
    }
    
})

app.delete("/notas",function(req,res){
    let id = req.body.student_id
    let deleteMarks=
    `DELETE
    FROM marks
    WHERE student_id=?`
    connection.query(deleteMarks,[id],function (err, resultado,field) {
        if (err) throw err;
        resultado.message = `Se ha eliminado correctamente la nota del estudiante con el id: ${id}`
        res.send(resultado.message);
    });
})


//GET ADICIONAL
app.get("/media", function(req,res){
    let id= req.query.id
    if(id!== undefined){
        let query=`SELECT AVG(mark) AS notaAlumno
        FROM marks
        WHERE student_id=?`
        connection.query(query,[id],function (err, resultado,field) {
            if (err) throw err;
            res.send(`La nota media obtenida por el alumno con el ${id} es igual a: ${JSON.stringify(resultado[0].notaAlumno)}`)
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
            
            res.send(respuesta);
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
        })
       
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


