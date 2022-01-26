import "dotenv/config"
import { NestFactory } from "@nestjs/core"
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const config = new DocumentBuilder()
    .setTitle("Twitter Clone")
    .setDescription("Twitter Clone API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const customSwaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document, customSwaggerOptions)
  app.listen(process.env["PORT"])
}
bootstrap()
