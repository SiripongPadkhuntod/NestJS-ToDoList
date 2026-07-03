import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskInspirationHandler } from './get-task-inspiration.handler';
import { GetTaskInspirationQuery } from '../queries/get-task-inspiration.query';
import { EXTERNAL_TASK_PROVIDER } from '../ports/external-task-provider.port';

describe('GetTaskInspirationHandler', () => {
  let handler: GetTaskInspirationHandler;

  // Mock ตัว Port ของ External API
  // ข้อดีของ Hexagonal Architecture คือเราจำลองแค่ Interface
  // โดยไม่ต้องสนใจว่าของจริงจะเป็น Axios หรือ Circuit Breaker เลย!
  const mockExternalProvider = {
    fetchTaskInspiration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskInspirationHandler,
        {
          provide: EXTERNAL_TASK_PROVIDER,
          useValue: mockExternalProvider,
        },
      ],
    }).compile();

    handler = module.get<GetTaskInspirationHandler>(GetTaskInspirationHandler);
  });

  afterEach(() => {
    jest.clearAllMocks(); // ล้างประวัติการเรียก Mock ทุกครั้งหลังจบเทส
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return inspiration data successfully', async () => {
    // 1. Arrange
    const expectedResult = { quote: 'Just do it!', author: 'Nike' };
    mockExternalProvider.fetchTaskInspiration.mockResolvedValue(expectedResult);
    
    const query = new GetTaskInspirationQuery();

    // 2. Act
    const result = await handler.execute(query);

    // 3. Assert
    expect(mockExternalProvider.fetchTaskInspiration).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if external provider fails', async () => {
    // 1. Arrange
    const error = new Error('External API is down');
    mockExternalProvider.fetchTaskInspiration.mockRejectedValue(error);
    
    const query = new GetTaskInspirationQuery();

    // 2. Act & Assert
    // ใช้คำสั่ง rejects.toThrow เพื่อเช็คว่าพ่น Error ออกมาตามคาดไหม
    await expect(handler.execute(query)).rejects.toThrow('External API is down');
    expect(mockExternalProvider.fetchTaskInspiration).toHaveBeenCalledTimes(1);
  });
});
