import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';

import { AddFoodDto } from './dto/add-food.dto';
import { GenerateFoodPictureUploadUrlDto } from './dto/generate-food-picture-upload-url.dto';

import { Food } from './entities/food.entity';
import MenuErrors from './menu.errors';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: EntityRepository<Food>,
    @InjectS3() private readonly s3: S3,
  ) {}

  async generateFoodPictureUploadUrl(
    generateFoodPictureUploadUrlDto: GenerateFoodPictureUploadUrlDto,
    ownerId: number,
  ) {
    const MAX_FILE_SIZE_IN_BYTES = 10485760; // 10MB

    const { filename } = generateFoodPictureUploadUrlDto;

    const fileContentType = mime.lookup(filename);
    const fileExt = mime.extension(fileContentType as string);

    return await this.s3.createPresignedPost({
      Bucket: 'sandysfoodexpress',
      Fields: {
        key: `user/${ownerId}/menu/foods/${uuid()}.${fileExt}`,
        ['Content-Type']: mime.lookup(filename),
      },
      Expires: 300,
      Conditions: [['content-length-range', 0, MAX_FILE_SIZE_IN_BYTES]],
    });
  }

  async addFood(addFoodDto: AddFoodDto, ownerId: number) {
    const { name, price, picture } = addFoodDto;

    await this.s3
      .getObject({
        Bucket: 'sandysfoodexpress',
        Key: picture,
      })
      .promise()
      .catch((e) => {
        if (e.code === 'NoSuchKey') {
          throw new BadRequestException(MenuErrors.InvalidFoodPicture);
        }
        throw new InternalServerErrorException();
      });

    const food = new Food(name, price, picture, ownerId);

    await this.foodRepository.persistAndFlush(food);

    return food;
  }

  async getFoods(ownerId: number) {
    let foods = await this.foodRepository.findAll({
      ownerId,
    });

    foods = await Promise.all(
      foods.map(async (food) => {
        return {
          ...food,
          picture: await this.s3.getSignedUrlPromise('getObject', {
            Bucket: 'sandysfoodexpress',
            Key: food.picture,
          }),
        };
      }),
    );

    return foods;
  }

  async deleteFood(ownerId: number, foodId: number) {
    await this.foodRepository.nativeDelete({
      ownerId,
      id: foodId,
    });
  }
}
