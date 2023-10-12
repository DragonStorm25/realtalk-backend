import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface KarmaDoc extends BaseDoc {
  user: ObjectId;
  karmaAmount: number;
}

export default class KarmaConcept {
  public readonly karma = new DocCollection<KarmaDoc>("karma");

  async increaseKarma(user: ObjectId, previouslyMistrusted: boolean) {
    const karma = await this.karma.readOne({ user });
    if (karma) {
      const increaseAmount = previouslyMistrusted ? 2 : 1;
      await this.karma.updateOne({ user }, { karmaAmount: karma.karmaAmount + increaseAmount });
    } else {
      await this.karma.createOne({ user, karmaAmount: 1 });
    }
    return { msg: "Karma successfully increased!", karmaInfo: await this.karma.readOne({ user }) };
  }

  async decreaseKarma(user: ObjectId, previouslyTrusted: boolean) {
    const karma = await this.karma.readOne({ user });
    if (karma) {
      const decreaseAmount = previouslyTrusted ? 2 : 1;
      await this.karma.updateOne({ user }, { karmaAmount: karma.karmaAmount - decreaseAmount });
    } else {
      await this.karma.createOne({ user, karmaAmount: 1 });
    }
    return { msg: "Karma successfully decreased!", karmaInfo: await this.karma.readOne({ user }) };
  }

  async getKarma(user: ObjectId) {
    const karma = await this.karma.readOne({ user });
    if (karma) {
      return karma?.karmaAmount;
    } else {
      // Assumes user exists and just has no stored karma
      return 0;
    }
  }
}
