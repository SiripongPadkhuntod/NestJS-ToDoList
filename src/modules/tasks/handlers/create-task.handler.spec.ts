import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskHandler } from './create-task.handler';
import { CreateTaskCommand } from '../commands/create-task.command';
import { TASK_REPOSITORY } from '../ports/task.repository';
import { TaskModel } from '../domain/task.model';

describe('CreateTaskHandler', () => {
  let handler: CreateTaskHandler;

  // Mock Repository: จำลองตัว Database แทนการใช้ Prisma ของจริง
  const mockTaskRepository = {
    createTask: jest.fn(),
  };

  beforeEach(async () => {
    // จำลอง Testing Module เหมือนกับการทำงานของ NestJS Dependency Injection
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskHandler,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateTaskHandler>(CreateTaskHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined(); // .toBeDefined() คือ การตรวจสอบว่า handler ถูกสร้างขึ้นมาแล้ว
  });

  it('should successfully create a task via repository', async () => {
    // 1. Arrange: เตรียมข้อมูลจำลอง
    const mockDto = { title: 'Buy milk', description: 'At the supermarket' };
    const mockUserId = '1';
    const command = new CreateTaskCommand(mockDto, mockUserId);

    const expectedTask = new TaskModel(
      '100',
      mockDto.title,
      mockDto.description,
      'PENDING',
      new Date(),
      mockUserId,
    );

    // จำลองให้ mockTaskRepository คืนค่าเป็น expectedTask เมื่อถูกเรียก
    mockTaskRepository.createTask.mockResolvedValue(expectedTask);

    // 2. Act: เรียกใช้ฟังก์ชันจริง
    const result = await handler.execute(command);

    // 3. Assert: ตรวจสอบผลลัพธ์
    // ตรวจสอบว่าถูกเรียกใช้งานด้วย Parameter ที่ถูกต้องหรือไม่
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(
      mockDto,
      mockUserId,
    );
    expect(mockTaskRepository.createTask).toHaveBeenCalledTimes(1);

    // ตรวจสอบว่าผลลัพธ์ที่ได้ออกมาตรงกับที่หวังไว้ไหม
    expect(result).toEqual(expectedTask);
    expect(result.id).toBe(100);
    expect(result.title).toBe('Buy milk');
  });
});
