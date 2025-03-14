import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
})();
