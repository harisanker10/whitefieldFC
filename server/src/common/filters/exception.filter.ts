import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(ExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.log('Error caught in Filter');
    console.log({ exception });
  }
}
