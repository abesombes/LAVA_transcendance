import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { generate } from "generate-password";
import axios from 'axios';

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
            secret: process.env.JWT_AT_SECRET,
            expiresIn: 60 * 15,
        },
    ),
        this.jwtService.signAsync(
        {
            sub: userId,
            email,
        }, 
        {
            secret: process.env.JWT_RT_SECRET,            
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
                hash: hash,
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
        const existing_user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!existing_user) throw new ForbiddenException("Access Denied");
        
        const rtMatches = await argon2.verify(existing_user.hashedRt, rt);
        if (!rtMatches)
            console.log("wrong password provided");
        if (!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(existing_user.id, existing_user.email);
        await this.updateRtHash(existing_user.id, tokens.refresh_token);
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
        return argon2.hash(data);
    }

    async googleLogin(req){
    var tokens: Tokens;
    if (!req.user){
        return 'No user from Google'
    }
    const existing_user = await this.prisma.user.findUnique({
        where: {
            email: req.user.email,
        }
    });

    if (!existing_user)
    {
        const password = generate(
            {	
                length: 10,
                numbers: true
            });
        const hash = await this.hashData(password);
        const new_user = await this.prisma.user.create({
            data: {
                email: req.user.email,
                firstname: req.user.firstName,
                surname: req.user.lastName,
                nickname: generateFromEmail(req.user.email, 3),
                hash: hash,
                avatar: req.user.picture
            },
        })
        tokens = await this.getTokens(new_user.id, new_user.email);
        await this.updateRtHash(new_user.id, tokens.refresh_token);
    }
    else
    {
        console.log("Welcome back existing User");
        tokens = await this.getTokens(existing_user.id, existing_user.email);
        await this.updateRtHash(existing_user.id, tokens.refresh_token);
    }
    return tokens;
    }


    async marvinLogin(code: string, state: string){
        if (!state || state != process.env.MARVIN_OUR_API_STATE)
            return ("Illegal middleman detection!");
            axios.post(process.env.MARVIN_OAUTH_TOKEN_URL, {
                grant_type: "authorization_code",
                client_id: process.env.MARVIN_CLIENT_ID,
                client_secret:process.env.MARVIN_CLIENT_SECRET,
                code: code,
                redirect_uri:process.env.MARVIN_OAUTH_CALLBACK_URL
              })
              .then(function (response) {
                console.log(response.data.access_token);
              })
              .catch(function (error) {
                console.log(error);
              });
    }
}