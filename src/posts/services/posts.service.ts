import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenaiService } from 'src/ai/services/openai.service';
import { CreatePostDto, UpdatePostDto } from '../dto/index';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly openaiService: OpenaiService,
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

  async create(post: CreatePostDto, userId: number) {
    try {
      const newPost = await this.postsRepository.save({
        ...post,
        author: { id: userId },
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

  async publish(id: number, userId: number) {
    const post = await this.findPost(id);

    if (post.author.id !== userId)
      throw new ForbiddenException('You are not allowed to publish this post');
    if (!post.content || !post.title || !post.categories.length)
      throw new BadRequestException('Post content is required');

    const summary = await this.openaiService.generateSummary(post.content);
    const coverImage = await this.openaiService.generateImage(summary);
    const newPost = this.postsRepository.merge(post, {
      isDraft: false,
      summary,
      coverImage,
    });

    const updatedPost = await this.postsRepository.save(newPost);
    return this.findPost(updatedPost.id);
  }
}
