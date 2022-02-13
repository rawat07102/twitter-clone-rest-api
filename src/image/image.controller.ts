import { Controller, Get, Param } from "@nestjs/common"
import { Types } from "mongoose"
import { ImageService } from "./image.service"

@Controller("image")
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get("all")
  async getAll() {
    return this.imageService.getAll()
  }

  @Get(":id")
  async getById(@Param("id") id: Types.ObjectId) {
    return this.imageService.getbyId(id)
  }

  // DEV
  @Get("delete/all")
  async deleteAll() {
    return this.imageService.deleteAll()
  }
}
