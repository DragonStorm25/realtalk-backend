import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface KarmaDoc extends BaseDoc {
  user: ObjectId;
  karmaAmount: number;
}

export default class KarmaConcept {
  public readonly karma = new DocCollection<KarmaDoc>("karma");

  async increaseKarma(user: ObjectId) {
    const karma = await this.karma.readOne({ user });
    if (karma) {
      await this.karma.updateOne({ user }, { karmaAmount: karma.karmaAmount + 1 });
    } else {
      await this.karma.createOne({ user, karmaAmount: 1 });
    }
    return { msg: "Karma successfully increased!", comment: await this.karma.readOne({ user }) };
  }
}
