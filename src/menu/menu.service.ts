import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';
import MenuErrors from './menu.errors';

import { AddFoodDto } from './dto/add-food.dto';
import { GenerateFoodPictureUploadUrlDto } from './dto/generate-food-picture-upload-url.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CreateScheduledMenuDto } from './dto/create-scheduled-menu.dto';

import Food from './models/food.model';
import MenuSchedule from './models/menu-schedule.model';

@Injectable()
export class MenuService {
  constructor(@InjectS3() private readonly s3: S3) {}

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

    const food = await Food.query().insert({
      name,
      picture,
      price,
      owner_id: ownerId,
    });

    return food;
  }

  async getFoods(ownerId: number, search: string) {
    let foods = (
      await Food.query().where('name', 'like', `%${search}%`)
    ).map((f) => f.toJSON());

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

    return foods.sort();
  }

  async deleteFood(ownerId: number, foodId: number) {
    const food = await Food.query().findOne({
      owner_id: ownerId,
      id: foodId,
    });
    if (!food) {
      throw new BadRequestException(MenuErrors.FoodNotFound);
    }

    await Food.query().deleteById(food.id);
  }

  async updateFood(
    ownerId: number,
    foodId: number,
    updateFoodDto: UpdateFoodDto,
  ) {
    const food = await Food.query().findOne({
      owner_id: ownerId,
      id: foodId,
    });
    if (!food) {
      throw new BadRequestException(MenuErrors.FoodNotFound);
    }

    const { name, price, picture } = updateFoodDto;

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

    await this.s3
      .deleteObject({
        Bucket: 'sandysfoodexpress',
        Key: food.picture,
      })
      .promise();

    const updatedFood = await Food.query().patchAndFetchById(food.id, {
      name,
      price,
      picture,
    });

    return updatedFood;
  }

  async createScheduledMenu(createScheduledMenuDto: CreateScheduledMenuDto) {
    const { scheduledAt, foodIds } = createScheduledMenuDto;

    await MenuSchedule.query().insertGraph(
      {
        scheduled_at: new Date(scheduledAt).toISOString(),
        foods: foodIds.map((foodId) => ({ id: foodId })),
      },
      {
        relate: true,
      },
    );
  }
}
