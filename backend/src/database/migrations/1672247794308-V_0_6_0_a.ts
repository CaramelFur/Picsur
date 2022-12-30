import { MigrationInterface, QueryRunner } from "typeorm";

export class V060A1672247794308 implements MigrationInterface {
    name = 'V060A1672247794308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db"`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "FK_37055605f39b3f8847232d604f8"`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a"`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "image_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "data" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75"`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "image_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "data" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_95953be58a506e5de46feec618" ON "e_image_file_backend" ("_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff1ecff935b8d7bdcea8908781" ON "e_image_derivative_backend" ("_id") `);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a" UNIQUE ("image_id", "variant")`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75" UNIQUE ("image_id", "key")`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "FK_37055605f39b3f8847232d604f8" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "FK_37055605f39b3f8847232d604f8"`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db"`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" DROP CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75"`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" DROP CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff1ecff935b8d7bdcea8908781"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95953be58a506e5de46feec618"`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "image_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ALTER COLUMN "_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75" UNIQUE ("image_id", "key")`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "image_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ALTER COLUMN "_id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a" UNIQUE ("image_id", "variant")`);
        await queryRunner.query(`ALTER TABLE "e_image_derivative_backend" ADD CONSTRAINT "FK_37055605f39b3f8847232d604f8" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "e_image_file_backend" ADD CONSTRAINT "FK_8055f37d3b9f52f421b94ee84db" FOREIGN KEY ("image_id") REFERENCES "e_image_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
