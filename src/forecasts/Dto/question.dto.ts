import { IsInt, IsString } from "class-validator";

export class QuestionDto {
  @IsString()
  question: string;

  @IsInt()
  forecast_id: number;
}