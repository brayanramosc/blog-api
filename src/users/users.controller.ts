import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('/:id/posts')
  getUserPosts(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneWithPosts(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Put('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.usersService.update(id, changes);
  }
}
