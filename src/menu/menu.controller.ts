import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { DecodedTokenUserDetails } from 'common/decoded-token-user';
import { User } from 'decorators/user.decorator';
import { AuthGuard } from 'guards/auth-guard.decorator';
import { JoiValidationPipe } from 'pipes/joi-validation.pipe';

import { AddFoodDto } from './dto/add-food.dto';
import { GenerateFoodPictureUploadUrlDto } from './dto/generate-food-picture-upload-url.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import MenuSchema from './menu.schema';
import { MenuService } from './menu.service';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/menu/foods/upload-url')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(MenuSchema.generateFoodPictureUploadUrl))
  async generateFoodPictureUploadUrl(
    @Body() generateFoodPictureUploadUrlDto: GenerateFoodPictureUploadUrlDto,
    @User() user: DecodedTokenUserDetails,
  ) {
    return {
      data: await this.menuService.generateFoodPictureUploadUrl(
        generateFoodPictureUploadUrlDto,
        user.id,
      ),
    };
  }

  @Post('/menu/foods')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(MenuSchema.addFood))
  async addFood(@Body() addFoodDto: AddFoodDto, @User() user) {
    return {
      data: await this.menuService.addFood(addFoodDto, user.id),
    };
  }

  @Get('/menu/foods')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getFoods(@User() user: DecodedTokenUserDetails) {
    return {
      data: await this.menuService.getFoods(user.id),
    };
  }

  @Delete('/menu/foods/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteFood(@User() user: DecodedTokenUserDetails, @Param() params) {
    await this.menuService.deleteFood(user.id, params.id);
    return {};
  }

  @Patch('/menu/foods/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async updateFood(
    @User() user: DecodedTokenUserDetails,
    @Param() params,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    await this.menuService.updateFood(user.id, params.id, updateFoodDto);
    return {};
  }
}
