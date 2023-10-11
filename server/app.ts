import FriendConcept from "./concepts/friend";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";
import CommentConcept from "./concepts/comment";
import LikeConcept from "./concepts/likes";
import TrustConcept from "./concepts/trusts";
import KarmaConcept from "./concepts/karma";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Comment = new CommentConcept();
export const Like = new LikeConcept();
export const Trust = new TrustConcept();
export const Karma = new KarmaConcept();
