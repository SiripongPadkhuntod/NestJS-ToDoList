import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // หัวข้อ 2.7 และ 2.8: ป้องกัน Route ต้องล็อกอินก่อน (มี JWT Token)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // เส้นทางดึงข้อมูลตัวเอง (ต้องอยู่ก่อน :id ไม่งั้น 'me' จะมองเป็น :id)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของตัวเอง' })
  @ApiResponse({ status: 200, description: 'คืนค่าข้อมูลผู้ใช้งานที่กำลังล็อกอินอยู่' })
  getProfile(@Request() req) {
    // req.user ได้มาจากตอนผ่าน JwtAuthGuard
    return this.usersService.findOne(req.user.userId);
  }

  // หัวข้อ 2.7, 2.8 และ 2.9: ป้องกัน Route + เช็ค Role ว่าต้องเป็น ADMIN ถึงจะดึงดูข้อมูลคนอื่นได้
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
