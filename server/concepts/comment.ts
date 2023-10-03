import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  content: string;
}

export default class PostConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");
}
