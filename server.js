/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dennis Castro Student ID: 122875222 Date: June 14, 2023
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));


collegeData.initialize()
  .then(() => {
    //home.html
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/home.html"));
    });

    //about.html
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/about.html"));
    });

    //htmlDemo.html
    app.get("/htmlDemo", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    });

    app.get("/sample.css", (req, res) => {
      res.sendFile(path.join(__dirname, "/views/sample.css"));
    });

    //students.json

    app.get("/students", (req, res) => {
        const courseNumber = req.query.course;
      
        if (courseNumber) {
          collegeData.getStudentsByCourse(courseNumber)
            .then((students) => {
              if (students.length > 0) {
                res.send(students);
              } else {
                res.send({ message: "No results" });
              }
            })
            .catch(() => {
              res.send({ message: "Error" });
            });
        } else {
          collegeData.getAllStudents()
            .then((students) => {
              res.send(students);
            })
            .catch(() => {
              res.send({ message: "Error" });
            });
        }
      });
      

  app.get("/tas", (req, res) => {
    collegeData.getTAs()
      .then((tas) => {
        res.send(tas);
      })
      .catch(() => {
        res.send({ message: "no results" });
      });
  });
  

  app.get("/courses", (req, res) => {
    collegeData.getCourses()
      .then((courses) => {
        res.send(courses);
      })
      .catch(() => {
        res.send({ message: "no results" });
      });
  });
  
  
  app.get("/student/:studentId", (req, res) => {
    const studentId = req.params.studentId;
  
    collegeData.getStudentByNum(studentId)
      .then((student) => {
        if (student) {
          res.send(student);
        } else {
          res.status(404).send({ message: "No student record with the given studentNum" });
        }
      })
      .catch((error) => {
        console.log("Error retrieving student:", error);
        res.status(500).send({ message: "Error!" });
      });
  });
  
  


    // [ no matching route ]
    app.use((req, res) => {
      res.status(404).send("Page Not Found");
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
