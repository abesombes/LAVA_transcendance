import { Body, Controller, HttpCode, HttpStatus, Redirect, Param, Query, Post, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { generate } from "generate-password";


@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        console.log("I am in Google Auth");
    }
  
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req: Request){
      return this.authService.googleLogin(req)
    }

    @Get('marvin')
    @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=42a3b64eee675b3850058c804e485115de4a51ddc88cc1c76f093f17d48568ee&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fmarvin%2Fcallback&state=m5TZ6Abf9rd9Z5WF74W2&response_type=code', 302)
    async marvinAuth()
    {     
    }

    @Get('marvin/callback')
    marvinAuthRedirect(@Query('code') code: string, @Query('state') state: string)
    {
        return this.authService.marvinLogin(code, state);
    }


    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens>{
        return this.authService.signinLocal(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user;
        return this.authService.logout(user['sub']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshTokens(user['sub'], user['refreshToken'])
    }
}
