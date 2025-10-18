import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto, UpdatePostDto } from '../dto/index';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    return await this.postsRepository.find({
      relations: ['author.profile'],
    });
  }

  async findOne(id: number) {
    const post = await this.findPost(id);
    return post;
  }

  async create(post: CreatePostDto) {
    try {
      const newPost = await this.postsRepository.save({
        ...post,
        author: { id: post.userId },
        categories: post.categoryIds?.map((id) => ({ id })),
      });
      return this.findPost(newPost.id);
    } catch {
      throw new BadRequestException('Error creating post');
    }
  }

  async update(id: number, changes: UpdatePostDto) {
    try {
      const post = await this.findPost(id);
      const updatedPost = this.postsRepository.merge(post, changes);
      return await this.postsRepository.save(updatedPost);
    } catch {
      throw new BadRequestException('Error updating post');
    }
  }

  async delete(id: number) {
    try {
      await this.postsRepository.delete(id);
      return { message: 'Post deleted successfully' };
    } catch {
      throw new BadRequestException('Error deleting post');
    }
  }

  private async findPost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author.profile', 'categories'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
