import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServiceHttpClient } from './service-http-client';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [ServiceHttpClient],
  exports: [ServiceHttpClient],
})
export class HttpClientModule {}
