import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"
import { User } from "user/entities/user.entity"

export type ChatDoc = Chat & Document
export type MessageDoc = Message & Document

@Schema({ timestamps: true, _id: false })
export class Message {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  from: User

  @Prop()
  body: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)

@Schema()
export class Chat {
  @Prop({ type: [{ type: MessageSchema }] })
  messages: Message[]

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: "User" }] })
  users: string[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
