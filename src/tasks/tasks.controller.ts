// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // บังคับให้ต้องล็อกอิน (มี Token) ถึงจะเรียก API ในนี้ได้ทั้งหมด
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูล Task ทั้งหมดของตัวเอง' })
  @ApiResponse({ status: 200, description: 'คืนค่าเป็น Array ของ Task', type: [TaskEntity] })
  async getAllTasks(@Request() req) {
    // req.user ได้มาจาก jwt.strategy.ts ตอน validate()
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูล Task ตาม ID' })
  @ApiResponse({ status: 200, description: 'คืนค่า Task 1 รายการ', type: TaskEntity })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task' })
  async getTaskById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'สร้าง Task ใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างสำเร็จ จะคืนค่าเป็น Task ที่สร้างใหม่', type: TaskEntity })
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูล Task' })
  @ApiResponse({ status: 200, description: 'แก้ไขสำเร็จ จะคืนค่า Task ที่อัปเดตแล้ว', type: TaskEntity })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task ที่จะแก้ไข' })
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบข้อมูล Task' })
  @ApiResponse({ status: 200, description: 'ลบสำเร็จ จะคืนค่า Task ที่ถูกลบ', type: TaskEntity })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task ที่จะลบ' })
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.remove(id, req.user.userId);
  }
}