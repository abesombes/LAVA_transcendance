import { Body, Controller, Get, Post, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport'
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  hashData(data:string): Promise<string> {
    return argon2.hash(data);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {

  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req){
    return this.appService.googleLogin(req)
  }

  @Put('api/users/create')
  async createUser(@Body() body: UserDto): Promise<any> {
    const user = await prisma.user.create({
      data: {
        email: body.email, 
        nickname: body.nickname,
        hash: body.password
        },
      })
  }

  @Post('api/users/create-user')
  async createUser2(@Body() body: UserDto): Promise<any> {
    const user = await prisma.user.create({
      data: {
        email: body.email, 
        nickname: body.nickname,
        hash: body.password
        },
      })
  }


  @Get('api/fetch-users')
  async fetchUsers(): Promise<any> {
    const users = await prisma.user.findMany()
    return (users);
  }

  @Get('api/fetch-user/:id')
  async fetchUser(@Param('id') id: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
    return (user);
  }

  @Delete('api/delete-user/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    })
    return (user);
  }

  // @Get('api')
  // getHello(): any {
  //   return this.appService.getHello();
  // }

  @Get()
  getRootRoute(){
    return 'hi there!';
  }
}
