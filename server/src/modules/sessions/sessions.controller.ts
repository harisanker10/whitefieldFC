import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { isValid } from 'date-fns';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  findOne(@Query('day') day: string, @Query('coachId') coachId: string) {
    if (day && !isValid(new Date(day))) {
      throw new BadRequestException(
        'Invalid param day. Use YYYY-MM-DD format.',
      );
    }

    if (day) {
      return this.sessionsService.findByDay(day);
    } else {
      return this.sessionsService.find({ coachId });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }

  @Patch('coach/:id')
  updateCoach(
    @Param('id') id: string,
    @Body() body: { coachId: string; markAbsent?: boolean },
  ) {
    if (!id || !body.coachId) {
      throw new BadRequestException();
    }
    return this.sessionsService.updateCoach({
      coachId: body.coachId,
      sessionId: id,
      markAbsent: body.markAbsent || false,
    });
  }
}
