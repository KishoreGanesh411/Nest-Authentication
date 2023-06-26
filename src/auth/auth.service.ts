import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // Check if user already exists
    const existingUser =
      await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

    if (existingUser) {
      throw new ForbiddenException(
        'Email is already taken',
      );
    }

    // Generate the password hash
    const hash = await argon.hash(dto.password);

    // Save the new user in the db
    const newUser = await this.prisma.user.create(
      {
        data: {
          email: dto.email,
          hash,
        },
      },
    );

    return this.signToken(
      newUser.id,
      newUser.email,
    );
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

    // If user does not exist, throw an exception
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    // Compare the password
    const passwordMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    // If the password is incorrect, throw an exception
    if (!passwordMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    UserId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: UserId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
