import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService
        ){}

    hashData(data:string){
        return argon2.hash(data);
    }

    async getTokens(userId: string, email: string) {
        const [at, rt] = await Promise.all([
        this.jwtService.signAsync(
        {
            sub: userId,
            email,
        }, 
        {
            secret: process.env.AT_SECRET,
            expiresIn: 60 * 15,
        },
    ),
        this.jwtService.signAsync(
        {
            sub: userId,
            email,
        }, 
        {
            secret: process.env.AT_SECRET,
            expiresIn: 60 * 60 * 24 * 7,
        },
        ),
    ]);
        return {
            access_token: at,
            refresh_token: rt
        }
    }

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                nickname: dto.nickname,
                hash,
            }
        });
        const tokens = await this.getTokens(newUser.id, newUser.email)
        return tokens;
    }

    signinLocal(){

    }
    logout(){}
    refreshTokens(){}
}
