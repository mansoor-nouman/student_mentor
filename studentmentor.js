const path = require("path");
const os = require("os");
const express = require("express");
const app = express();
app.use(express.json());

let mentors = [],students = [];

app.post("/mentor", function(req,res){
    req.body.id = mentors.length + 1;
    mentors.push(req.body);
    res.send("Mentor added");
})

app.get("/mentors", function(req,res){
    res.json(mentors);
})

app.post("/student", function(req,res){
    req.body.id = students.length + 1;
    students.push(req.body);
    res.send("Student added");
})

app.get("/students", function(req,res){
    res.json(students);
})

app.get("/student/:id", function(req,res){
    let studentId = req.params.id;
    let student = students.find((obj) => obj.id == studentId);
    if(student){
        res.json(student)
    }else
    {
        res.json({
            message: "User not found"
        })
    }
})



app.delete("/student/:id", function(req,res){
    students.splice(students.findIndex(obj => obj.id == req.params.id),1)
    res.json({
        message: "Student Deleted"
    })
})

app.put("/mentor/:id", function(req,res){
    let mentorId = req.params.id;
    let studentswithNoMentors = students.filter((item) => {
        return !item.mentor;
    })

    if(studentswithNoMentors.length > 0){
        let mentorIndex = mentors.findIndex((obj) => {
        return   obj.id == mentorId;
    })

    let mentorObj = mentors[mentorIndex];
    studentswithNoMentors.map((item) =>{
        if(mentorObj.students){
            mentorObj.students.push(item.name);
        }
        else{
            mentorObj.students = [item.name];
            item.mentor = mentorObj.name;
            item.mentorId = mentorObj.id;
        }
    });
}
res.json({
    message : "student assigned to mentor"
})   
})

app.get("/mentor/:id", function(req,res){
    let mentorId = req.params.id;
    if(mentors.length > 0){
        let mentorIndex = mentors.findIndex((obj) => obj.id == mentorId);
        let mentor = mentors[mentorIndex];
        if(mentor && mentor.students){
            res.json(mentor.students);
        }
        else{
            res.json(`students are not assigned to mentor ${mentorId}`);
        }
    }
    else{
        res.json("no mentor for this id")
    }
})
app.listen(8080);