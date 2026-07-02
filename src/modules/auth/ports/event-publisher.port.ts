export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';

export interface IEventPublisher {
  publish(eventName: string, payload: any): void;
}
