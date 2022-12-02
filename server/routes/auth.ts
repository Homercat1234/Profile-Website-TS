import express from "express";
import cors from "cors";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Profile } from "../models/account";

const authRouter = express.Router();

authRouter.use(express.json());
authRouter.use(cors());

authRouter.post("/create", async (req, res) => {
  try {
    let passwordHash = req.body.password;
    let salt = await genSalt(10);
    passwordHash = await hash(passwordHash, salt);

    let emailHash = req.body.email;
    salt = await genSalt(10);
    emailHash = await hash(emailHash, salt);

    let date = new Date(Date.now());
    date.setDate(date.getDate() + 1);

    const token = jwt.sign({ hash: emailHash, date }, passwordHash);

    const user = new Profile({
      email: req.body.email,
      hash: passwordHash,
      session: token,
      profile: {
        name: req.body.name,
        bio: req.body.bio,
        url: req.body.url,
      },
    });

    user.save();
    return res.status(200).json({ token, date, email: req.body.email });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email == null || password == null)
      return res.status(400).json({ message: "A required parameter was null" });
    if (email == "" || password == "")
      return res
        .status(400)
        .json({ message: "A required parameter was not found" });

    const findAccount = await Profile.findOne().where({ email });

    if (findAccount == null)
      return res.status(404).json({ message: "User not found" });

    const validPassword = await compare(password, findAccount!.hash);
    if (validPassword) {
      let emailHash = email;
      const salt = await genSalt(10);
      emailHash = await hash(emailHash, salt);

      let date = new Date(Date.now());
      date.setDate(date.getDate() + 1);

      const token = jwt.sign({ hash: emailHash, date }, findAccount!.hash);

      await Profile.updateOne(
        { email },
        {
          session: token,
        }
      );

      await findAccount.save();
      return res
        .status(200)
        .json({ token, date, email: req.body.email, result: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid Password", result: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const { token, email } = req.body;

    if (email == null || token == null)
      return res.status(400).json({ message: "A required parameter was null" });
    if (email == "" || token == "")
      return res
        .status(400)
        .json({ message: "A required parameter was not found" });

    const findAccount = await Profile.findOne().where({ email });

    if (findAccount == null)
      return res.status(404).json({ message: "User not found" });

    await Profile.updateOne(
      { email },
      {
        session: null,
      }
    );

    await findAccount.save();
    return res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

authRouter.post("/verify", async (req, res) => {
  try {
    if (
      req.body.token == null ||
      req.body.token == "" ||
      req.body.email == "" ||
      req.body.email == null
    )
      return res
        .status(400)
        .json({ message: "A required parameter was not found", result: false });

    const email = req.body.email as String;
    const token = req.body.token;
    const hash = await Profile.findOne().where({ email }).select("hash");
    const session = await Profile.findOne().where({ email }).select("session");

    if (hash!.hash == null)
      return res
        .status(400)
        .json({ message: "Hash was not found", result: false });
    if (session!.session != token)
      return res
        .status(400)
        .json({ message: "Session was not found", result: false });

    jwt.verify(token, hash!.hash as any);
    const decoded = jwt.decode(token, { json: true });
    
    if ((decoded!.date as Date) < new Date(Date.now()))
      return res
        .status(400)
        .json({ message: "Session expired", result: false });

    return res.status(200).json({ result: true });
  } catch (error) {
    return res.status(400).json({ message: error, result: false });
  }
});

export default authRouter;
