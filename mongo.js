const mongoose = require("mongoose");
const process = require("process");

const numArgs = process.argv.length;
if (numArgs < 3) {
    console.log(
        "Formats:\n\tTo add a new entry  : node mongo.js <password> <name> <number>\n\tTo view all entries : node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://fullstackopen:${password}@cluster0.d5aa1.mongodb.net/personsDb?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => {
    const personSchema = mongoose.Schema({
        name: String,
        number: String,
    });
    const Person = mongoose.model("Person", personSchema);

    if (numArgs === 3) {
        Person.find({}).then((result) => {
            console.log("phonebook:");
            result.forEach((p) => console.log(p.name, p.number));
            mongoose.connection.close();
        });
    } else if (numArgs === 5) {
        const name = process.argv[3];
        const number = process.argv[4];

        const newPerson = new Person({ name, number });
        newPerson.save().then((_result) => {
            console.log(`added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        });
    }
});
