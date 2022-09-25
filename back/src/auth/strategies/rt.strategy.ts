import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
// import { JwtPayload, JwtPayloadWithRt } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshTokens = req.get('authorization').replace('Bearer','').trim();
        return {
            ...payload,
            refreshTokens,
        };
    }
}
