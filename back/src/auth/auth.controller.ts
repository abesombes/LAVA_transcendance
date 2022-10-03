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
    @Redirect(process.env.MARVIN_OUR_API_URL, 302)
    async marvinAuth()
    {     
    }

    @Get('marvin/callback')
    marvinAuthRedirect(@Query('code') code: string, @Query('state') state: string)
    {
        try {
            return this.authService.marvinLogin(code, state);
          } catch (error) {
        throw error;
        }
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
