import { UserService } from './user.service';
import { Body, Controller, Get, Post, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';

@Get('user/find/:id')
async findOne(@Param('id') id: string): Promise<any> {
  return (await this.userService.fetchOneUser(id));
}