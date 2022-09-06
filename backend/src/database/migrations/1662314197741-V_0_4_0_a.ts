import { MigrationInterface, QueryRunner } from 'typeorm';

export class V040A1662314197741 implements MigrationInterface {
  name = 'V040A1662314197741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "e_api_key_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "last_used" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "UQ_a244964afdff398bab8a45017c8" UNIQUE ("key"), CONSTRAINT "PK_e31f7dfe2db917a6ed1024f4e8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a244964afdff398bab8a45017c" ON "e_api_key_backend" ("key") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ADD "delete_key" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" ADD CONSTRAINT "FK_3a32374df29b25152a84f0d1025" FOREIGN KEY ("userId") REFERENCES "e_user_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_api_key_backend" DROP CONSTRAINT "FK_3a32374df29b25152a84f0d1025"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" DROP COLUMN "delete_key"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a244964afdff398bab8a45017c"`,
    );
    await queryRunner.query(`DROP TABLE "e_api_key_backend"`);
  }
}
