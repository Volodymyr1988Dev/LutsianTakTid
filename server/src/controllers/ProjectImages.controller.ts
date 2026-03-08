import { Controller, Param, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectImagesService } from '../services/ProjectImages.service';

@ApiTags('Project Images')
@Controller('project-images')
export class ProjectImagesController {
  constructor(private readonly imagesService: ProjectImagesService) {}

  @Get('project/:projectId')
  getByProject(
    @Param('projectId') projectId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.imagesService.getByProject(
      projectId,
      Number(page),
      Number(limit),
    );
  }
}
