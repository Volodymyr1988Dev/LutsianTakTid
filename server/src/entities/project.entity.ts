import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectImage } from './projectImages.entity';
@Entity('projects')
export class Projects {
  @ApiProperty({
    description: 'Unique identifier for the project',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Street or village name of project',
    example: 'Lund',
  })
  @Column({ type: 'text', default: null })
  city!: string;

  @ApiProperty({
    description: 'Street address of the project',
    example: 'Maskinvägen 12',
  })
  @Column({ type: 'text', default: null })
  address!: string;

  @ApiProperty({
    description: 'Creation date of the project record',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
  @OneToMany(() => ProjectImage, (img) => img.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images!: ProjectImage[];
}
