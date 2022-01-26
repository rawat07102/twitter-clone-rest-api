import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { SchemaTypes, Types } from "mongoose"

@Schema()
export class User {
  @Prop()
  name: string

  @Prop()
  username: string

  @Prop()
  password: string

  @Prop({ default: "" })
  bio: string

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
}

export const UserSchema = SchemaFactory.createForClass(User).set("toJSON", {
  getters: true,
})
