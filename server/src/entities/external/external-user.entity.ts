import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ExternalProjectAssignment } from './external-project-assignment.entity';

@Entity('users')
export class ExternalUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @OneToMany(
    () => ExternalProjectAssignment,
    (a) => a.user,
  )
  assignments!: ExternalProjectAssignment[];
}