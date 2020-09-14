const { request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :post")
// );

// app.use(requestLogger());

let persons = [
  {
    name: "Ada Lovelace",
    number: "87238917381",
    id: 1,
  },
  {
    name: "Arto Hellas",
    number: "0123809123",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "1231236084923",
    id: 3,
  },
  {
    name: "Mary Poppendiek",
    number: "676344098",
    id: 4,
  },
];

//GET

app.get("/", (req, res) => {
  res.send("Welcome to Phonebook");
});

app.get("/info", (req, res) => {
  const total = `Phonebook has a total of ${persons.length} people in it`;
  const date = new Date();

  res.send(`<p>${total}</p><p>${date}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

//DELETE

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//POST

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing in post request",
    });
  } else if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: genID(),
    date: new Date(),
  };
  persons = persons.concat(person);
  res.send(person);
  console.log(JSON.stringify(req.body));
  // morgan.token("post", function (req, res) {
  //   return JSON.stringify(req.body);
  // });
});

//LISTEN

const PORT = process.env.PORT || 3001;
app.listen(PORT, (req, res) => {
  console.log("Server is on");
});

//SUPPORT FUNCTIONS

const genID = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// const requestLogger = (req, res, next) => {
//     console.log("Method", req.method);
//     console.log("Path", req.path);
//     console.log("Body", req.body);
//     console.log("________");
//     next();
//   };

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);
