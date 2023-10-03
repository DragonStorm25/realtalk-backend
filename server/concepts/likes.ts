import { ObjectId, IntegerType } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface LikeDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  like: IntegerType;
}

export default class LikeConcept {
  public readonly comments = new DocCollection<LikeDoc>("likes");
}
