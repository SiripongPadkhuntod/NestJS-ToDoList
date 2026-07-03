// src/tasks/tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetTasksQuery } from './queries/get-tasks.query';
import { GetTaskInspirationQuery } from './queries/get-task-inspiration.query';
import { CreateTaskCommand } from './commands/create-task.command';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { User } from '@modules/auth/user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // บังคับให้ต้องล็อกอิน (มี Token) ถึงจะเรียก API ในนี้ได้ทั้งหมด
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('inspiration')
  @ApiOperation({
    summary: 'ดึงข้อมูลแรงบันดาลใจจากภายนอก (ทดสอบ Circuit Breaker)',
  })
  @ApiResponse({ status: 200, description: 'ข้อมูลแรงบันดาลใจ หรือ Fallback' })
  async getInspiration() {
    return this.queryBus.execute(new GetTaskInspirationQuery());
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูล Task ทั้งหมดของตัวเอง' })
  @ApiResponse({
    status: 200,
    description: 'คืนค่าเป็น Array ของ Task',
    type: [TaskEntity],
  })
  async findAll(@User('userId') userId: string) {
    // หัวข้อ 3.6 CQRS: ใช้ QueryBus แทนการเรียก Service ตรงๆ
    return this.queryBus.execute(new GetTasksQuery(userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูล Task ตาม ID' })
  @ApiResponse({
    status: 200,
    description: 'คืนค่า Task 1 รายการ',
    type: TaskEntity,
  })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task' })
  async findOne(@Param('id') id: string, @User('userId') userId: string) {
    return await this.tasksService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'สร้าง Task ใหม่' })
  @ApiResponse({
    status: 201,
    description: 'สร้างสำเร็จ จะคืนค่าเป็น Task ที่สร้างใหม่',
    type: TaskEntity,
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User('userId') userId: string,
  ) {
    // หัวข้อ 3.6 CQRS: ใช้ CommandBus แทนการเรียก Service ตรงๆ
    return this.commandBus.execute(
      new CreateTaskCommand(createTaskDto, userId),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูล Task' })
  @ApiResponse({
    status: 200,
    description: 'แก้ไขสำเร็จ จะคืนค่า Task ที่อัปเดตแล้ว',
    type: TaskEntity,
  })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task ที่จะแก้ไข' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('userId') userId: string,
  ) {
    return await this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบข้อมูล Task' })
  @ApiResponse({
    status: 200,
    description: 'ลบสำเร็จ จะคืนค่า Task ที่ถูกลบ',
    type: TaskEntity,
  })
  @ApiResponse({ status: 404, description: 'ไม่พบ Task ที่จะลบ' })
  async remove(@Param('id') id: string, @User('userId') userId: string) {
    return await this.tasksService.remove(id, userId);
  }
}
