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
      throw new AppError('Customer not found');
    }

    const productsFiltered = await this.productsRepository.findAllById(
      products,
    );

    if (productsFiltered.length < 1) {
      throw new AppError('Products not found');
    }

    const productsFormatted = productsFiltered.map((product, index) => {
      const { quantity } = products[index];

      if (quantity > product.quantity) {
        throw new AppError('Product with insufficient quantities');
      }

      return {
        product_id: product.id,
        price: product.price,
        quantity,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsFormatted,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateProductService;
