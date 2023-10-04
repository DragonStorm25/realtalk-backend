import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export enum LikeType {
  Like = 1,
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
    const like = await this.likes.readOne({ author });
    if (!like || like.like == LikeType.Dislike) {
      await this.likes.deleteOne({ author });
      const _id = await this.likes.createOne({ author, target, like: LikeType.Like });
      return { msg: "Like successfully applied!", comment: await this.likes.readOne({ _id }) };
    } else {
      throw new AlreadyLiked(author, target);
    }
  }

  async dislike(author: ObjectId, target: ObjectId) {
    const dislike = await this.likes.readOne({ author });
    if (!dislike || dislike.like == LikeType.Like) {
      await this.likes.deleteOne({ author });
      const _id = await this.likes.createOne({ author, target, like: LikeType.Dislike });
      return { msg: "Disike successfully applied!", comment: await this.likes.readOne({ _id }) };
    } else {
      throw new AlreadyDisliked(author, target);
    }
  }

  async neutralize(author: ObjectId, target: ObjectId) {
    await this.likes.deleteOne({ author, target });
    return { msg: "Likes and dislikes removed successfully!" };
  }

  async getLikes(target: ObjectId) {
    const likeDislikes = await this.likes.readMany({ target: target });
    const likeCount = likeDislikes.filter((x: LikeDoc) => x.like == LikeType.Like).length;
    const dislikeCount = likeDislikes.filter((x: LikeDoc) => x.like == LikeType.Dislike).length;
    return { likes: likeCount, dislikes: dislikeCount };
  }
}

export class AlreadyLiked extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has already liked {1}!", author, _id);
  }
}

export class AlreadyDisliked extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} has already disliked {1}!", author, _id);
  }
}
