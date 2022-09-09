import { MigrationInterface, QueryRunner } from 'typeorm';

export class V040B1662485374471 implements MigrationInterface {
  name = 'V040B1662485374471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ADD "expires_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8055f37d3b9f52f421b94ee84d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ALTER COLUMN "image_id" SET DATA TYPE UUID USING image_id::uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_37055605f39b3f8847232d604f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "image_id" SET DATA TYPE UUID USING image_id::uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8055f37d3b9f52f421b94ee84d" ON "e_image_file_backend" ("image_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37055605f39b3f8847232d604f" ON "e_image_derivative_backend" ("image_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a" UNIQUE ("image_id", "variant")`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75" UNIQUE ("image_id", "key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "FK_37055605f39b3f8847232d604f8" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "FK_37055605f39b3f8847232d604f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_37055605f39b3f8847232d604f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8055f37d3b9f52f421b94ee84d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ALTER COLUMN "image_id" SET DATA TYPE character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37055605f39b3f8847232d604f" ON "e_image_derivative_backend" ("image_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75" UNIQUE ("image_id", "key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" DROP COLUMN "image_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ALTER COLUMN "image_id" SET DATA TYPE character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8055f37d3b9f52f421b94ee84d" ON "e_image_file_backend" ("image_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a" UNIQUE ("image_id", "variant")`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" DROP COLUMN "expires_at"`,
    );
  }
}
