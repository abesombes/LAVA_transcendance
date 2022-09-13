import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

//email: string, name: string

  @Post('api/users/create')
  async createUser(@Body() body): Promise<any> {
    const user = await prisma.user.create({
      data: {
        email: body.email, 
        name: body.name,
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

  @Get('api')
  getHello(): any {
    return this.appService.getHello();
  }

  @Get()
  getRootRoute(){
    return 'hi there!';
  }
}
