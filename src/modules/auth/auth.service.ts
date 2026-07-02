import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@modules/users/ports/user.repository';
import type { IUserRepository as IUserRepositoryType } from '@modules/users/ports/user.repository';
import { AuthRegisterDto, AuthLoginDto } from './dto/auth.dto';
import { IPasswordHasher, PASSWORD_HASHER } from './ports/password-hasher.port';
import { ITokenGenerator, TOKEN_GENERATOR } from './ports/token-generator.port';
import { IEventPublisher, EVENT_PUBLISHER } from './ports/event-publisher.port';
import type { IPasswordHasher as IPasswordHasherType } from './ports/password-hasher.port';
import type { ITokenGenerator as ITokenGeneratorType } from './ports/token-generator.port';
import type { IEventPublisher as IEventPublisherType } from './ports/event-publisher.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: IUserRepositoryType,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasherType,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGeneratorType,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisherType,
  ) {}

  async register(authRegisterDto: AuthRegisterDto) {
    const { email, password } = authRegisterDto;
    
    // Check if user exists
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password using port
    const hashedPassword = await this.passwordHasher.hash(password);

    // Save user
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    // Publish event using port
    this.eventPublisher.publish('user.created', {
      userId: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async login(authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare password using port
    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Generate token using port
    return {
      access_token: this.tokenGenerator.generateToken(payload),
    };
  }
}
