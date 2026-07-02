import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventPublisher } from '../ports/event-publisher.port';

@Injectable()
export class NestEventPublisher implements IEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(eventName: string, payload: any): void {
    this.eventEmitter.emit(eventName, payload);
  }
}
