const { Schema, model } = require("mongoose");

const fileSchema = new Schema({
  filename: String,
  mimetype: String,
  path: String
});

export default model("File", fileSchema);