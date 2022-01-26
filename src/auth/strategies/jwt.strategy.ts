import { PassportStrategy } from "@nestjs/passport"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Request } from "express"
import { Strategy, StrategyOptions } from "passport-jwt"
import { User } from "user/entities/user.entity"

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req.headers.authorization) {
          return req.headers.authorization.split(" ")[1]
        }
        return null
      },
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: true,
    } as StrategyOptions)
  }

  async validate(payload: { id: string; username: string }) {
    const user = await this.userModel.findById(payload.id)
    if (!user) {
      return false
    }
    return payload
  }
}
