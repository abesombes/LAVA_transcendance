import { ForbiddenException, Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tokens, User, MarvinUser, GoogleUser } from './types';
import { JwtService } from '@nestjs/jwt';
import { generateFromEmail, generateUsername } from "unique-username-generator";
import { generate } from "generate-password";
import axios from 'axios';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })