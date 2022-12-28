import { MigrationInterface, QueryRunner } from 'typeorm';

export class V050A1672154027079 implements MigrationInterface {
  name = 'V050A1672154027079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "e_system_state_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_f11f1605928b497b24f4b3ecc1f" UNIQUE ("key"), CONSTRAINT "PK_097ea165dadc8c14237481afd64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f11f1605928b497b24f4b3ecc1" ON "e_system_state_backend" ("key") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f11f1605928b497b24f4b3ecc1"`,
    );
    await queryRunner.query(`DROP TABLE "e_system_state_backend"`);
  }
}
