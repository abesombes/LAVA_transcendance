import {PassportStrategy} from "@nestjs/passport"

import {Strategy, VerifyCallback} from 'passport-google-oauth20'

import { Injectable } from '@nestjs/common'

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(){
        super({
            clientID : '432081304484-is86d1fdt4v3mv4smloiritttrh02moe.apps.googleusercontent.com',
            clientSecret: '{"web":{"client_id":"432081304484-is86d1fdt4v3mv4smloiritttrh02moe.apps.googleusercontent.com","project_id":"lavatranscendence","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","javascript_origins":["http://localhost:8080"]}}',
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ['email', 'profile'] 
        });
    }

async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
    const { name, emails, photos } = profile
    const user= {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken
    }
    done(null, user)
}
}