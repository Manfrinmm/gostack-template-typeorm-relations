import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createOrder = container.resolve(CreateOrderService);

    const { customer_id, products } = request.body;

    const order = await createOrder.execute({ customer_id, products });

    return response.status(201).json(order);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const findOrder = container.resolve(FindOrderService);

    const { order_id } = request.params;

    const order = await findOrder.execute({ order_id });

    return response.status(200).json(order);
  }
}
