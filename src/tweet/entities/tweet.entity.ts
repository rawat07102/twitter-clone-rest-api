import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"

@Schema({
  timestamps: true,
})
export class Tweet {
  @Prop()
  body: string

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  author: Types.ObjectId

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "Tweet" }] })
  replies: Types.ObjectId[]

  @Prop({ required: false, default: 0 })
  likes: number

  @Prop({
    type: { type: SchemaTypes.ObjectId, ref: "Image" },
    required: false,
  })
  image?: Types.ObjectId

  @Prop({ type: SchemaTypes.ObjectId, ref: "Tweet", required: false })
  replyTo?: Types.ObjectId

  createdAt: Date

  updatedAt: Date
}

export const TweetSchema = SchemaFactory.createForClass(Tweet).set("toJSON", {
  getters: true,
  versionKey: false,
})
