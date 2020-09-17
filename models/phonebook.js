const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => console.log("connected to mongodb"))
  .catch((error) => console.log("not to mongodb", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    unique: false,
    minlength: 8,
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
