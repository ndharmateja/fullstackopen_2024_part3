const mongoose = require("mongoose");
const process = require("process");

const mongoDbUri = process.env.MONGODB_URI;
mongoose
    .connect(mongoDbUri)
    .then((_result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-[0-9|_]+/.test(v) || /^[0-9]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
});

personSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
