import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found', 400);
    }

    const productsFiltered = await this.productsRepository.findAllById(
      products,
    );

    console.log('ids', productsFiltered);

    if (!productsFiltered) {
      throw new AppError('Products not found', 400);
    }

    const productsFormatted = productsFiltered.map(product => ({
      product_id: product.id,
      price: product.price,
      quantity: product.quantity,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: productsFormatted,
    });

    return order;
  }
}

export default CreateProductService;
