import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { EmailsService } from './email.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get('/sent')
  findOne(@Query('coachId') coachId: string) {
    return this.emailsService.getEmailsOfCoach(coachId);
  }
  @Get('/replies')
  findReplies(@Query('coachId') coachId: string) {
    return this.emailsService.getReplies(coachId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
