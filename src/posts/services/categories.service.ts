import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/index';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoriesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.findCategory(id);
    return category;
  }

  async findPostsByCategory(id: number) {
    const category = await this.categoriesRepository.find({
      where: { id },
      relations: ['posts'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(category: CreateCategoryDto) {
    try {
      const newCategory = await this.categoriesRepository.save(category);
      return newCategory;
    } catch {
      throw new BadRequestException('Error creating category');
    }
  }

  async update(id: number, changes: UpdateCategoryDto) {
    try {
      const category = await this.findCategory(id);
      const updatedCategory = this.categoriesRepository.merge(
        category,
        changes,
      );
      return await this.categoriesRepository.save(updatedCategory);
    } catch {
      throw new BadRequestException('Error updating category');
    }
  }

  async delete(id: number) {
    try {
      await this.categoriesRepository.delete(id);
      return { message: 'Category deleted successfully' };
    } catch {
      throw new BadRequestException('Error deleting category');
    }
  }

  private async findCategory(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
