import { Injectable } from '@nestjs/common';
import { IExternalTaskProvider } from '../ports/external-task-provider.port';
import { ServiceHttpClient } from '@core/http-client/service-http-client';

@Injectable()
export class HttpExternalTaskProvider implements IExternalTaskProvider {
  constructor(private readonly httpClient: ServiceHttpClient) {}

  async fetchTaskInspiration(): Promise<any> {
    // ดึง URL จาก .env หรือใช้ค่า Default ถ้าไม่มี
    const url = process.env.EXTERNAL_INSPIRATION_API_URL || 'https://httpstat.us/500';
    return this.httpClient.get(url); 
  }
}
