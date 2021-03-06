import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { DecodedTokenUserDetails } from 'src/common/decoded-token-user';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth-guard.decorator';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';

import MenuSchema from './menu.schema';

import { AddFoodDto } from './dto/add-food.dto';
import { CreateScheduledMenuDto } from './dto/create-scheduled-menu.dto';
import { GenerateFoodPictureUploadUrlDto } from './dto/generate-food-picture-upload-url.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

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
  async getFoods(
    @Query('q') search: string,
    @User() user: DecodedTokenUserDetails,
  ) {
    return {
      data: await this.menuService.getFoods(user.id, search),
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

  @Post('/menu')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(MenuSchema.createScheduledMenu))
  async createScheduledMenu(
    @User() user: DecodedTokenUserDetails,
    @Body() createScheduledMenuDto: CreateScheduledMenuDto,
  ) {
    await this.menuService.createScheduledMenu(createScheduledMenuDto);

    return {};
  }
}
