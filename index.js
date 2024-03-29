require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Person = require("./models/Person");
const mw = require("./middleware");
const process = require("process");

const app = express();

// Middleware
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(mw.requestLogger);

// Routes
app.route("/info").get((_req, res) => {
    Person.countDocuments({}).then((count) => {
        const dateString = new Date().toString();
        return res.send(
            `<p>Phonebook has info for ${count} people</p><p>${dateString}</p>`
        );
    });
});

app.route("/api/persons")
    .get((_req, res) => {
        Person.find({}).then((persons) => res.json(persons));
    })
    .post((req, res, next) => {
        const { name, number } = req.body;

        const newPerson = new Person({ name, number });
        newPerson
            .save()
            .then((p) => res.json(p))
            .catch((e) => next(e));
    });

app.route("/api/persons/:id")
    .get((req, res, next) => {
        Person.findById(req.params.id)
            .then((p) => (p ? res.json(p) : res.status(404).end()))
            .catch((e) => next(e));
    })
    .delete((req, res, next) => {
        Person.findByIdAndDelete(req.params.id)
            .then(() => res.status(204).end())
            .catch((e) => next(e));
    })
    .put((req, res, next) => {
        const { name, number } = req.body;
        console.log("number:", number);
        Person.findByIdAndUpdate(
            req.params.id,
            { name, number },
            { new: true, runValidators: true, context: "query" }
        )
            .then((p) => (p ? res.json(p) : res.status(404).end()))
            .catch((e) => next(e));
    });

//Unknown route
app.use(mw.notFoundRoute);

// Error handler
app.use(mw.errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started. Listening on ${PORT}.`));
