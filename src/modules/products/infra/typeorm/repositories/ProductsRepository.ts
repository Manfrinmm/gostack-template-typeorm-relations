import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const products_ids = products.map(product => product.id);

    const productsFiltered = await this.ormRepository.find({
      where: { id: In(products_ids) },
    });

    return productsFiltered;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const foundProducts = await this.findAllById(products);

    const foundProductsUpdated = foundProducts.map((product, index) => {
      const { quantity } = products[index];

      return {
        ...product,
        quantity: product.quantity - quantity,
      };
    });

    await this.ormRepository.save(foundProductsUpdated);

    return products as Product[];
  }
}

export default ProductsRepository;
