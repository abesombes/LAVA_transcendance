import { ForbiddenException, Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { generate } from "generate-password";
import axios from 'axios';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

async findOne(id: string){
return await this.prisma.user.findUnique({
    where: {
      id: id,
    },
  })
}

}