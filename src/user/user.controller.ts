import {
  Controller,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { user } from '@prisma/client';
import { jwtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(jwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() User: user) {
    return User;
  }

  @Patch()
  edituser() {}
}
