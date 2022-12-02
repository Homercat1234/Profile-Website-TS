import express from "express";
import cors from "cors";
import { Profile } from "../models/account";
import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

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
    let password;
    if (req.body.auth.password != null && req.body.auth.password != "") {
      // If password change, rehash
      let passwordHash = req.body.auth.password;
      let salt = await genSalt(10);
      password = await hash(passwordHash, salt);
    }

    const token = req.body.token; // Verify User
    const session = await Profile.findOne()
      .where({ email: req.body.email })
      .select("session");
    const hashValue = await Profile.findOne()
      .where({ email: req.body.email })
      .select("hash");
    if (session!.session != token)
      return res
        .status(400)
        .json({ message: "Session was not found", result: false });

    if (hashValue!.hash == null)
      return res
        .status(400)
        .json({ message: "Hash was not found", result: false });
    if (session!.session != token)
      return res
        .status(400)
        .json({ message: "Session was not found", result: false });

    jwt.verify(token, hashValue!.hash as any);
    const decoded = jwt.decode(token, { json: true });

    if ((decoded!.date as Date) < new Date(Date.now()))
      return res
        .status(400)
        .json({ message: "Session expired", result: false });

    const { email } = req.body.auth; // Update
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
