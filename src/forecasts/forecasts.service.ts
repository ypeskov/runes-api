import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { ForecastDto } from './Dto/forecast.dto';

@Injectable()
export class ForecastsService {
  constructor(@InjectKnex() private readonly db: Knex) { }

  async getAllForecasts(): Promise<ForecastDto[]> {
    return await this.db({ d: 'forecasts' }).select();
  }

  async getForecast(divinationId: number, question: string, ip: string, origin: string): Promise<RuneAnswer[]> {
    const numberOfRunes: number = this.getNumberOfRunes(divinationId);
    const randomRuneOrders: number[] = this.getRandomOrders(numberOfRunes);
    const runes: RuneWithTranslation[] = await this.retrieveRunesFromDB(randomRuneOrders);
    const answers: RuneAnswer[] = this.getAnswers(runes);
    this.saveAnswer(answers, question, ip, origin);

    return answers;
  }

  async saveAnswer(answers: RuneAnswer[], question: string, ip: string, origin: string): Promise<void> {
    await this.db('answers').insert({
      question,
      ip,
      origin,
      answer: JSON.stringify(answers)
    });
  }

  getNumberOfRunes(divinationId): number {
    let numberOfRunes = 1;
    switch (divinationId) {
      case 1:
        numberOfRunes = 1;
        break;
      case 2:
        numberOfRunes = 2;
        break;
      case 3:
        numberOfRunes = 3;
        break;
      default:
        throw new NotFoundException('Unknown forecast');
    }

    return numberOfRunes;
  }

  getRandomOrders(numberOfRunes): number[] {
    const orders: number[] = [];
    for (let i = 1; i < 25; orders.push(i), i++) {
    }

    return orders
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(-numberOfRunes);
  }

  async retrieveRunesFromDB(ordersList): Promise<RuneWithTranslation[]> {
    return this.db({ r: 'runes' })
      .select({
        order: 'r.order',
        has_inverted: 'r.has_inverted',
        title: 'rt.title',
        description: 'rt.description',
        forecast_direct: 'rt.forecast_meaning_direct',
        forecast_inverted: 'rt.forecast_meaning_inverted'
      })
      .join('runetranslations as rt', 'r.id', 'rt.rune_id')
      .whereIn('r.order', ordersList);
  }

  getAnswers(runes: RuneWithTranslation[]): RuneAnswer[] {
    const answers: RuneAnswer[] = runes.map(rune => {
      const temp_answer: RuneAnswer = {
        'title': rune.title,
        description: rune.description,
        forecast: rune.forecast_direct,
        position: 'Direct position'
      };
      if (rune.has_inverted) {
        const is_inverted = Math.floor(Math.random() * 2);
        if (is_inverted) {
          temp_answer.forecast = rune.forecast_inverted;
          temp_answer.position = 'Inverted position';
        }
      }

      return temp_answer;
    });

    return answers;
  }
}

interface RuneWithTranslation {
  order: number;
  has_inverted: boolean;
  title: string;
  description: string;
  forecast_direct: string;
  forecast_inverted: string;
}

export interface RuneAnswer {
  title: string;
  description: string;
  forecast: string;
  position: string;
}

