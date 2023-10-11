import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface KarmaDoc extends BaseDoc {
  user: ObjectId;
  karmaAmount: number;
}

export default class KarmaConcept {
  public readonly karma = new DocCollection<KarmaDoc>("karma");
}
