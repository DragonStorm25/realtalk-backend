import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError, NotAllowedError } from "./errors";

export interface CommentDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  content: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: ObjectId, target: ObjectId, content: string) {
    const _id = await this.comments.createOne({ author, target, content });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
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
    return { msg: "Comment successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const post = await this.comments.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
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

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
