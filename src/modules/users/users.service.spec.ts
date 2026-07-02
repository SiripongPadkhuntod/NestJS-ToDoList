import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@core/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  // หัวข้อ 3.8 Testing: การทำ Mock (จำลอง) PrismaService เพื่อไม่ให้ต่อ Database จริงๆ
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // ใช้ของปลอมแทน
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('ควรจะคืนค่า user ถ้าหาเจอใน Database', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'USER' };
      // จำลองให้ Prisma คืนค่า mockUser กลับมา
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toEqual('test@example.com');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('ควรจะโยน NotFoundException ถ้าหาไม่เจอ', async () => {
      // จำลองให้ Prisma คืนค่า null (หาไม่เจอ)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
