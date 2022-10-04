import { Body, Controller, HttpCode, HttpStatus, Redirect, Param, Query, Post, Response, Request, Req, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
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
    logout(@Req() req) {
        const user = req.user;
        return this.authService.logout(user['sub']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req) {
        const user = req.user;
        return this.authService.refreshTokens(user['sub'], user['refreshToken'])
    }

    @Post('2fa/turn-on')
	@HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
        console.log("line 74 OK");
        console.log("user['sub']: " + request.user['sub']);
        console.log("user['email']: " + request.user['email']);
        console.log("user['twoFactorAuthSecret']: " + request.user['twoFactorAuthSecret']);
        const isCodeValid =
        this.authService.isTwoFactorAuthCodeValid(
            body.twoFactorAuthCode,
            request.user,
        );
        console.log("line 79 OK");
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.turnOnTwoFactorAuth(request.user.id);
    }
	
	@Post('2fa/generate')
    @HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthGuard('jwt'))
    async register(@Response() response, @Request() request) {
		const { otpAuthUrl } = await this.authService.generateTwoFactorAuthSecret(request.user);
		console.log(otpAuthUrl);
		return response.json(await this.authService.generateQrCodeDataURL(otpAuthUrl),);
		// return response.json(await this.authService.generateQrCode(response, otpAuthUrl));
	}

	@Post('2fa/authenticate')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard('jwt'))
	async authenticate(@Request() request, @Body() body) {
		const isCodeValid = this.authService.isTwoFactorAuthCodeValid(
			body.twoFactorAuthCode,
			request.user,
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		return this.authService.signin2FA(request.user);
	}

}
