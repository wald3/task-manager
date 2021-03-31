import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "./intefaces/jwt-payload.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'ToPsEcReT',
        });
    }

    async validate(payload: JwtPayload){
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });
        // console.log('validation:', payload, user);
        
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}