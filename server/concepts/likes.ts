import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

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
    const _id = await this.likes.createOne({ author, target, like: LikeType.Like });
    return { msg: "Like successfully applied!", comment: await this.likes.readOne({ _id }) };
  }

  async dislike(author: ObjectId, target: ObjectId) {
    const _id = await this.likes.createOne({ author, target, like: LikeType.Dislike });
    return { msg: "Disike successfully applied!", comment: await this.likes.readOne({ _id }) };
  }

  async neutralize(_id: ObjectId) {
    await this.likes.deleteOne({ _id });
    return { msg: "Likes and dislikes removed successfully!" };
  }

  async getLikes(target: ObjectId) {
    const likeDislikes = await this.likes.readMany(
      { target: target },
      {
        sort: { dateUpdated: -1 },
      },
    );
    const likeCount = likeDislikes.filter((x: LikeDoc) => x.like == LikeType.Like).length;
    const dislikeCount = likeDislikes.filter((x: LikeDoc) => x.like == LikeType.Dislike).length;
    return { likes: likeCount, dislikes: dislikeCount };
  }
}
