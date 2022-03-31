import mongoose from "mongoose";

const TownSchema = new mongoose.Schema({
    playerID: String,
    username: String,
    password: String
});

const Town = mongoose.model("Town", TownSchema);

export { Town };