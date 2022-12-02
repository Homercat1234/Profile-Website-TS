import jwt from "jsonwebtoken";
import { Profile } from "../models/account";

export const verify = async (email: String | string, token: String | string) => {
  try {
    const hash = await Profile.findOne().where({ email }).select("hash");
    const session = await Profile.findOne().where({ email }).select("session");

    if (hash!.hash == null || session!.session != token) return false;

    jwt.verify(token as string, hash!.hash as any);
    const decoded = jwt.decode(token as string, { json: true });

    if ((decoded!.date as Date) < new Date(Date.now())) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
