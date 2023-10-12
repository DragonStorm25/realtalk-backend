import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export enum TrustType {
  Trust = 1,
  Mistrust = -1,
}

export interface TrustDoc extends BaseDoc {
  author: ObjectId;
  target: ObjectId;
  trust: TrustType;
}

export default class TrustConcept {
  public readonly trusts = new DocCollection<TrustDoc>("trusts");

  async trust(author: ObjectId, target: ObjectId) {
    const trust = await this.trusts.readOne({ author, target });
    if (!trust || trust.trust == TrustType.Mistrust) {
      await this.trusts.deleteOne({ author });
      const _id = await this.trusts.createOne({ author, target, trust: TrustType.Trust });
      return { msg: "Trust successfully applied!", comment: await this.trusts.readOne({ _id }) };
    } else {
      throw new AlreadyTrusted(author, target);
    }
  }

  async mistrust(author: ObjectId, target: ObjectId) {
    const mistrust = await this.trusts.readOne({ author, target });
    if (!mistrust || mistrust.trust == TrustType.Trust) {
      await this.trusts.deleteOne({ author });
      const _id = await this.trusts.createOne({ author, target, trust: TrustType.Mistrust });
      return { msg: "Mistrust successfully applied!", comment: await this.trusts.readOne({ _id }) };
    } else {
      throw new AlreadyMistrusted(author, target);
    }
  }

  async neutralize(author: ObjectId, target: ObjectId) {
    const type = (await this.trusts.readOne({ author, target }))?.trust;
    await this.trusts.deleteOne({ author, target });
    return { msg: "Trusts and mistrusts removed successfully!", typeRemoved: type };
  }

  async getTrusts(target: ObjectId) {
    const trustsMistrusts = await this.trusts.readMany({ target: target });
    const trustCount = trustsMistrusts.filter((x: TrustDoc) => x.trust == TrustType.Trust).length;
    const mistrustCount = trustsMistrusts.filter((x: TrustDoc) => x.trust == TrustType.Mistrust).length;
    return { trusts: trustCount, mistrusts: mistrustCount };
  }
}

export class AlreadyTrusted extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has already trusted {1}!", author, _id);
  }
}

export class AlreadyMistrusted extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has already mistrusted {1}!", author, _id);
  }
}
