import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'guards/auth-guard.decorator';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @UseGuards(AuthGuard)
  @Get('/orders')
  async getOrders() {
    return {
      data: await this.orderService.getOrders(),
    };
  }
}
