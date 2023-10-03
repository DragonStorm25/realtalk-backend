import { ObjectId, IntegerType } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export enum LikeType {
  Like,
  Neutral,
  Dislike,
}

export interface LikeDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  like: LikeType;
}

export default class LikeConcept {
  public readonly likes = new DocCollection<LikeDoc>("likes");
}
