const express = require("express");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Data
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

// Functions
const generateId = () => Math.floor(Math.random() * 10000000);

// Routes
app.route("/info").get((_req, res) => {
  const dateString = new Date().toString();
  return res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${dateString}</p>`
  );
});

app
  .route("/api/persons")
  .get((_req, res) => res.json(persons))
  .post((req, res) => {
    const { name, number } = req.body;

    if (!name) return res.status(400).json({ error: "name missing" });
    if (!number) return res.status(400).json({ error: "number missing" });

    if (persons.map((p) => p.name.toLowerCase()).includes(name.toLowerCase()))
      return res.status(400).json({ error: "name must be unique" });

    const person = { name, number, id: generateId() };

    persons = persons.concat(person);
    return res.json(person);
  });

app
  .route("/api/persons/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((p) => p.id === id);

    // If person is not found
    // we return not found
    if (!person) {
      return res.status(404).end();
    }

    return res.json(person);
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((p) => p.id !== id);
    return res.status(204).end();
  });

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server started. Listening on ${PORT}.`));
