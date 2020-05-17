import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class EditProductPriceField1589738392660
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'products',
      'price',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 12,
        scale: 2,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'products',
      'price',
      new TableColumn({
        name: 'price',
        type: 'integer',
      }),
    );
  }
}
