import express from "express";
import cors from "cors";
import { Profile } from "../models/account";
import { genSalt, hash } from "bcrypt";
import { verify } from "../functions/verify";


const profileRouter = express.Router();

profileRouter.use(express.json());
profileRouter.use(cors());

profileRouter.post("/", (req, res) => {
  try {
    const profile = new Profile({
      profile: {
        name: req.body.name,
        bio: req.body.bio,
        url: req.body.url,
      },
    });

    const saved = profile.save();
    return res.status(200).send(saved);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

profileRouter.patch("/", async (req, res) => {
  try {
    let email = req.body.email as String;
    const token = req.body.token as String;

    const result = await verify(email, token);

    if(result === false)
      return res.status(400).send("Invalid session");

    let password;
    if (req.body.auth.password != null && req.body.auth.password != "") {
      // If password change, rehash
      let passwordHash = req.body.auth.password;
      let salt = await genSalt(10);
      password = await hash(passwordHash, salt);
    }

    email = req.body.auth.email; // Update
    const { url, bio, name } = req.body.profile;

    const profile = await Profile.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          ...(email != null && email !== "" && { email }),
          ...(password != null && password !== "" && { hash: password }),
          ...(url != null && url !== "" && { "profile.url": url }),
          ...(bio != null && bio !== "" && { "profile.bio": bio }),
          ...(name != null && name !== "" && { "profile.name": name }),
        },
      },
      { new: true }
    );

    const saved = await profile!.save();
    return res.status(200).send(saved);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

profileRouter.get("/", async (req, res) => {
  try {
    return res.status(200).send(await Profile.find().select("profile"));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

profileRouter.post("/email", async (req, res) => {
  try {
    return res
      .status(200)
      .send(await Profile.findOne({ email: req.body.email }).select("profile"));
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export default profileRouter;
