import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ERole } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ enum: ERole, default: ERole.USER })
  role: ERole;
}
