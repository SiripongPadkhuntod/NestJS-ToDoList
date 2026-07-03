import { Test, TestingModule } from '@nestjs/testing';
import { MailQueueService } from './mail-queue.service';

import { getQueueToken } from '@nestjs/bullmq';

describe('MailQueueService', () => {
  let service: MailQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailQueueService,
        {
          provide: getQueueToken('mail'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailQueueService>(MailQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
