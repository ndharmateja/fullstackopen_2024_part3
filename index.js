const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Data
const persons = [
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

// Routes
app.route("/info").get((_req, res) => {
  const dateString = new Date().toString();
  return res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${dateString}</p>`
  );
});
app.route("/api/persons").get((_req, res) => res.json(persons));

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server started. Listening on ${PORT}.`));
