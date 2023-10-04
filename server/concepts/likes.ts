import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export enum LikeType {
  Like = 1,
  Neutral = 0,
  Dislike = -1,
}

export interface LikeDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  like: LikeType;
}

export default class LikeConcept {
  public readonly likes = new DocCollection<LikeDoc>("likes");

  async like(author: ObjectId, target: ObjectId) {
    const _id = await this.likes.createOne({ author, target, like: LikeType.Like });
    return { msg: "Like successfully applied!", comment: await this.likes.readOne({ _id }) };
  }

  async dislike(author: ObjectId, target: ObjectId) {
    const _id = await this.likes.createOne({ author, target, like: LikeType.Dislike });
    return { msg: "Disike successfully applied!", comment: await this.likes.readOne({ _id }) };
  }
}
