import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception.response && exception.response.message) ||
      exception.message.error ||
      exception.message;

    response.status(status).json({
      status,
      message,
    });
  }
}
