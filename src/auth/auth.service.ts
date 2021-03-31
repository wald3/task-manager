import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) { }

    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.singUp(authCredentialsDto);
    }

    async singIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accesstoken: string }> {
        const username = await this.userRepository.signIn(authCredentialsDto);
        
        if (!username) {
            throw new UnauthorizedException('Credentials are wrong!');
        }

        const payload: JwtPayload = { username };
        const accesstoken = await this.jwtService.sign(payload);

        return { accesstoken };
    }
}
