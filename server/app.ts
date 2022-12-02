import express from "express";
import mongoose from "mongoose";
import profileRouter from "./routes/profile";
import accountRouter from "./routes/auth";
import { Profile } from "./models/account";
import { genSalt, hash } from "bcrypt";

//mongoose.connect(`${process.env.DATABASE}`);
mongoose.connect("mongodb://127.0.0.1:27017/profile");
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", async () => {
  console.log("Database Connected");
  if (
    (await Profile.findOne().where({ admin: true })) == null &&
    (await Profile.findOne().where({ email: "admin" }) == null)
  ) {

    const passwordHash = await hash("password", await genSalt(10));

    const admin = new Profile({
      email: "admin",
      hash: passwordHash,
      profile: {
        name: "admin",
        bio: "System Administrator",
        url: "https://thumbs.dreamstime.com/b/admin-stamp-seal-watermark-distress-style-blue-vector-rubber-print-admin-title-scratched-texture-grunge-textured-133645421.jpg",
        admin: true,
      },
    });

    admin.save();
  }
});

const app = express();
const port = process.env.PORT || 3001;

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
