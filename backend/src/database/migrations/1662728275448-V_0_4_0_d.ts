import { MigrationInterface, QueryRunner } from 'typeorm';

export class V040D1662728275448 implements MigrationInterface {
  name = 'V040D1662728275448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" ALTER COLUMN "created" SET DATA TYPE TIMESTAMP WITH TIME ZONE, ALTER COLUMN "created" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" ALTER COLUMN "last_used" SET DATA TYPE TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "created" SET DATA TYPE TIMESTAMP WITH TIME ZONE, ALTER COLUMN "created" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "last_read" SET DATA TYPE TIMESTAMP WITH TIME ZONE, ALTER COLUMN "last_read" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "last_read" SET DATA TYPE TIMESTAMP, ALTER COLUMN "last_read" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "expires_at" SET DATA TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "created" SET DATA TYPE TIMESTAMP, ALTER COLUMN "created" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" ALTER COLUMN "last_used" SET DATA TYPE TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" ALTER COLUMN "created" SET DATA TYPE TIMESTAMP, ALTER COLUMN "created" SET NOT NULL`,
    );
  }
}
