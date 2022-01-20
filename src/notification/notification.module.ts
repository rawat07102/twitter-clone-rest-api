import { forwardRef, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UserModule } from "user/user.module"
import {
  NotificationSchema,
  Notification,
} from "./entities/notification.entity"
import { NotificationService } from "./notification.service"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
