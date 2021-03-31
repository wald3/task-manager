import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials-dto";
import { SqliteErrorCode } from "./enums/sqlite-error-code.enum";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.password = await this.hasgPassword(password, await bcrypt.genSalt());
        
        try {
            await user.save();
        } catch (error) {
            console.log(error, error.code === SqliteErrorCode.UniqueInsertionError);
            
            if (error.code === SqliteErrorCode.UniqueInsertionError) {
                throw new ConflictException('User with such username is alrady exists!');
            } else if (error.code === SqliteErrorCode.DatabaseLocked) {
                throw new ConflictException('Database is locked!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await this.validatePassword(user.password, password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hasgPassword(password: string, salt: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } 

    private async validatePassword(hashedPassword: string, plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}