import { MigrationInterface, QueryRunner } from 'typeorm';

export class V032A1662029904716 implements MigrationInterface {
  name = 'V032A1662029904716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ADD "file_name" character varying NOT NULL DEFAULT 'image'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" DROP COLUMN "file_name"`,
    );
  }
}
