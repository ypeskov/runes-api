import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ForecastsModule } from './forecasts/forecasts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: "postgres",
          useNullAsDefault: true,
          connection: {
            host: process.env.RUNES_DB_HOST,
            database: process.env.RUNES_DB_NAME,
            user:     process.env.RUNES_DB_USER,
            password: process.env.RUNES_DB_PASSWORD
          },
        },
      }),
    }),
    ForecastsModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
