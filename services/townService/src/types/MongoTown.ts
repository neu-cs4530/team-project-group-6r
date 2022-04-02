import mongoose from "mongoose";

const TownSchema = new mongoose.Schema({
    townID: String
});

const Town = mongoose.model("Town", TownSchema);

export { Town };