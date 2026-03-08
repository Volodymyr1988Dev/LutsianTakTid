import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from '../services/Project.service';
import type { AuthRequest } from '../types/auth.request.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }
}
