const mongoose = require("mongoose");

const credSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, ref: "customers" },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const Cred = mongoose.model("creds", credSchema);

module.exports = Cred;
