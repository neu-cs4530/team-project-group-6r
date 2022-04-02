import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    playerID: String,
    username: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

export { User };