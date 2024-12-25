import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  // Register User
  async registerUser(body: any) {
    const { email, username, password } = body;

    if (!email || !username || !password) {
      throw new BadRequestException(
        'Username, email, and password must be provided',
      );
    }

    this.logger.debug('Checking if email or username already exists');

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      this.logger.warn(
        `Email or username already in use: ${email || username}`,
      );
      throw new BadRequestException('Email or username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    this.logger.log('New user registered successfully');
    return await this.userRepository.save(user);
  }
  // Login User
  async login(body: any) {
    const { email, password } = body;
    this.logger.debug('Authenticating user');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn('Invalid email or password provided');
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    this.logger.log('User authenticated successfully');
    return { token };
  }
}
