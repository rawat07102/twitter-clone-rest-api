import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { UserModule } from "user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: {
          expiresIn: "365 days",
        },
      }),
    }),
  ],
  providers: [AuthController, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
