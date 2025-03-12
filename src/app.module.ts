import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const env = config.get<string>('NODE_ENV');
        const commonConfig: Partial<TypeOrmModuleOptions> = {
          type: config.get<'sqlite' | 'postgres'>('TYPEORM_CONNECTION')!,
          entities: [`${__dirname}/entity/*.entity.{ts,js}`],
        };

        if (env === 'test' || env === 'development') {
          return {
            ...commonConfig,
            database: config.get<string>('TYPEORM_DATABASE'),
            synchronize: true,
            dropSchema: env === 'test',
            logging: env === 'development',
          } as TypeOrmModuleOptions;
        }

        if (env === 'production') {
          return {
            ...commonConfig,
            host: config.get<string>('TYPEORM_HOST'),
            port: config.get<number>('TYPEORM_PORT'),
            username: config.get<string>('TYPEORM_USERNAME'),
            password: config.get<string>('TYPEORM_PASSWORD'),
            database: config.get<string>('TYPEORM_DATABASE'),
            synchronize: false,
            migrations: [],
            migrationsRun: true,
            ssl: {
              rejectUnauthorized: true,
            },
            logging: ['error', 'warn'],
          } as TypeOrmModuleOptions;
        }

        throw new Error('Invalid NODE_ENV value');
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
