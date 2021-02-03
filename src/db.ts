const {mongoose} = require("mongoose");
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

export  async function connect() {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    console.error(err);
  }
};