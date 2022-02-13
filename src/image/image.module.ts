import { MongooseModule } from "@nestjs/mongoose"
import { Module } from "@nestjs/common"
import { Image, ImageSchema } from "./entities/image.entity"
import { ImageService } from "./image.service"
import { ImageController } from "./image.controller"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImageModule {}
