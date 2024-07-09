import express from "express";
import morgan from "morgan";

const app = express();
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* Data */
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

/* Routes */
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({
      error: "person not found",
    });
  }

  res.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameTaken = persons.find((p) => p.name === body.name);
  if (nameTaken !== undefined) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: getRandomInt(1000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/api/info", (request, response) => {
  const n = persons.length;
  const now = new Date();
  response.send(`<P>Phonebook has info for ${n} people.</P><P>${now}</P>`);
});

/* Server setup */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* Auxiliary functions */
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
