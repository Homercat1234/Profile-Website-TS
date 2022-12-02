import express from "express";
import mongoose from "mongoose";
import profileRouter from "./routes/profile";
import accountRouter from "./routes/auth";

mongoose.connect(`${process.env.DATABASE}`);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const port = process.env.PORT || 5000;

app.use("/", express.static("build"));
app.use("/login", express.static("build"));
app.use("/profile", express.static("build"));
app.use("/register", express.static("build"));

app.use("/api/profile", profileRouter);
app.use("/api/auth", accountRouter);

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});

export default database;
