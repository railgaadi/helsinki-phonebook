const express = require("express");
require("dotenv").config();
// const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/phonebook");
const { response } = require("express");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

//GET

app.get("/", (req, res) => {
  res.send("Welcome to Phonebook");
});

app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    const total = `Phonebook has a total of ${people.length} people in it`;
    const date = new Date();
    res.send(`<p>${total}</p><p>${date}</p>`);
  });
});

//GET ALL

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

//GET ONE

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

//DELETE

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

//POST

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing in post request",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: genID(),
    date: new Date(),
  });

  person
    .save()
    .then((person) => res.send(person))
    .catch((error) => next(error));

  // console.log(JSON.stringify(req.body));
  // morgan.token("post", function (req, res) {
  //   return JSON.stringify(req.body);
  // });
});

//Update

app.put(`/api/persons/:id`, (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson.toJSON()))
    .catch((error) => next(error));
});

//Middleware - unknown endpoint

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

//Middleware - error handler

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(422).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

//LISTEN

const PORT = process.env.PORT || 3001;
app.listen(PORT, (req, res) => {
  console.log("Server is on");
});

// //SUPPORT FUNCTIONS

// const genID = () => {
//   return Math.floor(100000 + Math.random() * 900000);
// };
