import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { isValid } from 'date-fns';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    console.log({ createSessionDto });
    return this.sessionsService.create(createSessionDto);
  }

  @Get(':day')
  findOne(@Param('day') day: string) {
    console.log({ day });
    if (!isValid(new Date(day))) {
      throw new BadRequestException(
        'Invalid param day. Use YYYY-MM-DD format.',
      );
    }
    return this.sessionsService.findByDay(day);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }
}
