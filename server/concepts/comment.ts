import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  content: string;
}

export default class PostConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: ObjectId, target: ObjectId, content: string) {
    const _id = await this.comments.createOne({ author, target, content });
    return { msg: "Comment successfully created!", post: await this.comments.readOne({ _id }) };
  }

  async getPosts(query: Filter<CommentDoc>) {
    const comment = await this.comments.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return comment;
  }
}
