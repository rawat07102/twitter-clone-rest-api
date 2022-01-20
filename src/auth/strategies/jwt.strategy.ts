import { PassportStrategy } from "@nestjs/passport"
import { Types } from "mongoose"
import { Request } from "express"
import { Strategy, StrategyOptions } from "passport-jwt"
import { UserService } from "user/user.service"

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req.headers.authorization) {
          return req.headers.authorization.split(" ")[1]
        }
        return null
      },
      secretOrKey: process.env["SECRET_KEY"],
      ignoreExpiration: true,
    } as StrategyOptions)
  }

  async validate(payload: { id: string; username: string }) {
    const user = await this.userService.findById(new Types.ObjectId(payload.id))
    if (!user) {
      return false
    }
    return payload
  }
}
