import { IsNotEmpty } from 'class-validator';
export class GetAllQuery {
  @IsNotEmpty({
    message: '缺少参数test'
  })
  test: string;
}
