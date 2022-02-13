import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CreateImageDTO } from "image/dto/create-image.dto"
import { Model, Types } from "mongoose"
import { Image } from "./entities/image.entity"

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async create({ data, mimetype }: CreateImageDTO) {
    const image = new this.imageModel({
      data,
      mimetype,
    })
    await image.save()
    return image
  }

  async getAll() {
    return this.imageModel.find().select("id")
  }

  async getbyId(id: Types.ObjectId) {
    return this.imageModel.findById(id)
  }

  async deleteAll() {
    const res = await this.imageModel.deleteMany()
    return res.deletedCount
  }

  async delete(id: Types.ObjectId) {
    return this.imageModel.findByIdAndDelete(id)
  }
}
