import { ObjectId, IntegerType } from "mongodb";

import { BaseDoc } from "../framework/doc";

export interface LikeDoc extends BaseDoc {
  target: ObjectId;
  likes: IntegerType;
  dislikes: IntegerType;
}
