import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"

@Schema()
export class User {
  @Prop({ text: true })
  name: string

  @Prop({ text: true })
  username: string

  @Prop()
  password: string

  @Prop({ default: "" })
  bio: string

  @Prop({ type: SchemaTypes.ObjectId, ref: "Image" })
  profilePic?: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: "Image" })
  headerPic?: Types.ObjectId

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Tweet" }] })
  tweets: Types.ObjectId[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "User" }] })
  followers: Types.ObjectId[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "User" }] })
  following: Types.ObjectId[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Notification" }] })
  notifications: Types.ObjectId[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Tweet" }] })
  timeline: Types.ObjectId[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Tweet" }] })
  likedTweets: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
  .set("toJSON", {
    getters: true,
  })
  .index({ name: "text", username: "text" })
