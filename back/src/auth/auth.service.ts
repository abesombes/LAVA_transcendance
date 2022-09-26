import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

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
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }



    async signinLocal(dto: AuthDto): Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
    });

        if (!user) throw new ForbiddenException("Access Denied");

        const passwordMatches = await argon2.verify(user.hash, dto.password);
        if (!passwordMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: string){
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt:
                {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            },
        });
    }

    async refreshTokens(userId: string, rt: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user)
            console.log("no such user");
        if (!user) throw new ForbiddenException("Access Denied");
        console.log(user.hashedRt);
        const rtMatches = await argon2.verify(user.hashedRt, rt);
        if (!rtMatches)
            console.log("wrong password provided");
        if (!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }


    async updateRtHash(userId: string, rt: string) {
        const hash = await this.hashData(rt)
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            }
        });
    }

    hashData(data:string){
        // return bcrypt(data, 10);
        return argon2.hash(data);
    }

}