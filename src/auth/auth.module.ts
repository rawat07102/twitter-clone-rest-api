import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "user/user.module"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: "365 days",
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
