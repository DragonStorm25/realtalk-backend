import { ObjectId } from "mongodb";

import { BaseDoc } from "../framework/doc";

export interface KarmaDoc extends BaseDoc {
  user: ObjectId;
  karmaAmount: number;
}
