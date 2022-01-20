import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"

@Schema()
export class Tweet {
  @Prop()
  body: string

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  author: Types.ObjectId

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Tweet" }] })
  replies: Types.ObjectId[]

  @Prop({ type: SchemaTypes.ObjectId, ref: "Tweet", required: false })
  replyTo?: Types.ObjectId
}

export const TweetSchema = SchemaFactory.createForClass(Tweet).set("toJSON", {
  getters: true,
})
