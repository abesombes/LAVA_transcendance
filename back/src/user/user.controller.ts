import { UserService } from './user.service';
import { Body, Controller, Get, Post, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

@Get('user/find/:id')
async findOne(@Param('id') id: string): Promise<any> {
  return (await this.userService.findOne(id));
}
}