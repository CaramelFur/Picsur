import { MigrationInterface, QueryRunner } from 'typeorm';

export class V057A1780617600000 implements MigrationInterface {
  name = 'V057A1780617600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ADD "source_filetype" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" DROP COLUMN "source_filetype"`,
    );
  }
}
