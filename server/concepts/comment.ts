import { ObjectId } from "mongodb";

import { BaseDoc } from "../framework/doc";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  content: string;
}
