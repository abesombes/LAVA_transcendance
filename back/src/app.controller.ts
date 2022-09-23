import { Body, Controller, Get, Post, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport'

const prisma = new PrismaClient();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


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
        password: body.password
        },
      })
  }

  @Post('api/users/create-user')
  async createUser2(@Body() body: UserDto): Promise<any> {
    const user = await prisma.user.create({
      data: {
        email: body.email, 
        nickname: body.nickname,
        password: body.password
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
        id: parseInt(id), // or Number(id)
      },
    })
    return (user);
  }

  @Delete('api/delete-user/:id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id), // or Number(id)
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
