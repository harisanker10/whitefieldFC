import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { Request } from 'express';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto, @Req() req: Request) {
    if (
      !createCoachDto ||
      !('name' in createCoachDto) ||
      !('email' in createCoachDto)
    ) {
      throw new BadRequestException();
    }
    return this.coachesService.create(createCoachDto);
  }

  @Get()
  findAll() {
    return this.coachesService.findAll();
  }
}
