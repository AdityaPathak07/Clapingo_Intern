const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Clapingo",{
    useUnifiedTopology: true,
        useNewUrlParser: true,
});
const newSchema = new mongoose.Schema({
    "name": String,
    "phoneNumber" : String,
    "email" : String,
    "password" : String,
    "teacher" : String
});

const Student = mongoose.model("Intern", newSchema);

module.exports = Student;