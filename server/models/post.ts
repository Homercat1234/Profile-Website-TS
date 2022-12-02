import { Schema, Types, model, Model } from "mongoose";

interface IEdited {
  editorID: String;
  number: Number;
}

interface IBlogPost {
  posterId: string;
  title: string;
  text: string;
  edits: IEdited;
}

type blogPostType = Model<IBlogPost>;

const blogPostSchema = new Schema<IBlogPost, blogPostType>(
  {
    posterId: { type: String, required: false, unique: true },
    title: { type: String, required: false },
    text: { type: String, required: false },
    edits: {
      type: new Schema<IEdited>(
        {
          editorID: { type: String, required: false },
          number: { type: Number, required: false },
        },
        { timestamps: true }
      ),
      required: false,
    },
  },
  { timestamps: true }
);

export const BlogPost = model<IBlogPost, blogPostType>("Posts", blogPostSchema);
