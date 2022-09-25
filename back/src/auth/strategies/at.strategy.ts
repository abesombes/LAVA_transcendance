import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload =
{
    sub: string;
    email: string;
};

// Argon2 hashedAT: $argon2id$v=19$m=4096,t=3,p=1$bk9dyguAxZRbJ8XPd6nGMA$5TREZI21rrzappis7PWNj5LrO3i6SsgloHyxx7104mY
// Argon2 hashedRT: $argon2id$v=19$m=4096,t=3,p=1$bk9dyguAxZRbJ8XPd6nGMA$5TREZI21rrzappis7PWNj5LrO3i6SsgloHyxx7104mY


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AT_SECRET,
        });
    }

    validate(payload: JwtPayload) {
        return payload;

    }
}
