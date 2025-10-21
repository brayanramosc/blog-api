import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'posts' })
export class Post {
  @ApiProperty({ description: 'The id of the post' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the post' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'The content of the post' })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({ description: 'The cover image of the post' })
  @Column({ type: 'varchar', length: 800, name: 'cover_image', nullable: true })
  coverImage: string;

  @ApiProperty({ description: 'The summary of the post' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  summary: string;

  @ApiProperty({ description: 'The post status' })
  @Column({ type: 'boolean', default: true, name: 'is_draft' })
  isDraft: boolean;

  @ApiProperty({ description: 'Creation date of the post' })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Update date of the post' })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ApiProperty({
    description: 'The categories of the post',
    type: [Category],
  })
  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'posts_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
