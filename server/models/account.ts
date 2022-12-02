import { Schema, Types, model, Model } from "mongoose";

interface IProfile {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  url: string;
  admin: Boolean
}

interface IAccount {
  email: string;
  hash: string;
  session: any;
  profile: IProfile;
}

type accountType = Model<IAccount>;

const accountSchema = new Schema<IAccount, accountType>({
  email: { type: String, required: false, unique: true },
  hash: { type: String, required: false },
  session: { type: String, required: false },
  profile: {
    type: new Schema<IProfile>({
      name: { type: String, required: false },
      bio: { type: String, required: false },
      url: { type: String, required: false },
      admin: { type: Boolean, required: false},
    }),
    required: false,
  },
});

export const Profile = model<IAccount, accountType>("Profiles", accountSchema);
