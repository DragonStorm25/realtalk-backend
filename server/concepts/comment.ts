import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

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

  async getComments(query: Filter<CommentDoc>) {
    const comment = await this.comments.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return comment;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getComments({ author });
  }

  async update(_id: ObjectId, update: Partial<CommentDoc>) {
    this.sanitizeUpdate(update);
    await this.comments.updateOne({ _id }, update);
    return { msg: "Post successfully updated!" };
  }

  private sanitizeUpdate(update: Partial<CommentDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["content", "options"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }
}
