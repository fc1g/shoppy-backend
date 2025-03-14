import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersPaginationDto } from './dtos/users-pagination.dto';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get('/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get()
  findAllUsers(@Query() query: UsersPaginationDto) {
    return this.usersService.find(query);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor)
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
