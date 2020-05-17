import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
export default class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @JoinColumn({ name: 'order_id' })
  @ManyToOne(() => Order, order => order.order_products)
  order: Order;

  @Column()
  product_id: string;

  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product, product => product.order_products)
  product: Product;

  @Column('decimal')
  price: number;

  @Column('integer')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
