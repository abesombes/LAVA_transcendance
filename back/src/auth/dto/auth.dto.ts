import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()    
    hash: string;

    @IsNotEmpty()
    @IsString()    
    nickname: string;

    @IsNotEmpty()
    @IsString()    
    password: string;

}