import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Request } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/roles.guard';
import { Roles } from '@modules/auth/roles.decorator';
import { User } from '@modules/auth/user.decorator';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  // หัวข้อ 2.7 และ 2.8: ป้องกัน Route ต้องล็อกอินก่อน (มี JWT Token)
  @UseGuards(JwtAuthGuard)
  // หัวข้อ 3.5 Caching: เปิดแคชสำหรับเส้นนี้ 60 วินาที
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_users')
  @CacheTTL(60000)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => new UserEntity(user));
  }

  // เส้นทางดึงข้อมูลตัวเอง (ต้องอยู่ก่อน :id ไม่งั้น 'me' จะมองเป็น :id)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของตัวเอง' })
  @ApiResponse({ status: 200, description: 'คืนค่าข้อมูลผู้ใช้งานที่กำลังล็อกอินอยู่' })
  getProfile(@User('userId') userId: string) {
    // หัวข้อ 3.2: ใช้ Custom Decorator @User() แทน @Request()
    return this.usersService.findOne(userId).then(user => new UserEntity(user));
  }

  // หัวข้อ 2.7, 2.8 และ 2.9: ป้องกัน Route + เช็ค Role ว่าต้องเป็น ADMIN ถึงจะดึงดูข้อมูลคนอื่นได้
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return new UserEntity(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return new UserEntity(user);
  }
}
