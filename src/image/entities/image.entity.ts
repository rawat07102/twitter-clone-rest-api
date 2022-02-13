import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema()
export class Image {
  @Prop()
  data: string

  @Prop()
  mimetype: string
}

export const ImageSchema = SchemaFactory.createForClass(Image).set("toJSON", {
  getters: true,
})
