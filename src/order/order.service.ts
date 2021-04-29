import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  async getOrders() {
    return {
      orders: [
        {
          id: 1,
          item: 'food',
        },
      ],
    };
  }
}
