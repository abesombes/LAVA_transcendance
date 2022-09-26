import { Module } from '@nestjs/common';
import { AtStrategy } from './strategies';
import { RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [JwtModule.register({ 
        secret: 'hard!to-guess_secret',
        signOptions: {expiresIn: 900}
    })],
    controllers: [AuthController],
    providers: [AuthService, AtStrategy, RtStrategy],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
