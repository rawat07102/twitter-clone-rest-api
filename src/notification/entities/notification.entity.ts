import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type NotificationDoc = Notification & Document

export enum NotificationType {
  NEW_TWEET = "NEW_TWEET",
}

const notificationEnum = ["NEW_TWEET"]

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: { enum: notificationEnum }, required: true })
  type: NotificationType

  @Prop({ required: true })
  title: string

  @Prop({ type: Boolean, default: false })
  read: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(
  Notification,
).index({ createdAt: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 })
