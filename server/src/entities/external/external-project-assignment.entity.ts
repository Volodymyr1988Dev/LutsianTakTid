import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ExternalUser } from './external-user.entity';

@Entity('project_assignments')
export class ExternalProjectAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  date!: string;

  @Column({ nullable: true })
  comment!: string;

  @Column('decimal')
  hours!: number;

  @ManyToOne(() => ExternalUser, (u) => u.assignments)
  @JoinColumn({ name: 'userId' })
  user!: ExternalUser;

  @Column()
  projectId!: string;

}