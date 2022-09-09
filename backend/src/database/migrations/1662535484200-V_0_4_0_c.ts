import { MigrationInterface, QueryRunner } from 'typeorm';

export class V040C1662535484200 implements MigrationInterface {
  name = 'V040C1662535484200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" DROP CONSTRAINT "UQ_576678406a479d569123a33e132"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1a427e855045fa793c275861a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" ALTER COLUMN "user_id" SET DATA TYPE UUID USING user_id::uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "user_id" SET DATA TYPE UUID USING user_id::uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1a427e855045fa793c275861a" ON "e_usr_preference_backend" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" ADD CONSTRAINT "UQ_576678406a479d569123a33e132" UNIQUE ("key", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" ADD CONSTRAINT "FK_f1a427e855045fa793c275861a7" FOREIGN KEY ("user_id") REFERENCES "e_user_backend"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" DROP CONSTRAINT "FK_f1a427e855045fa793c275861a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" DROP CONSTRAINT "UQ_576678406a479d569123a33e132"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1a427e855045fa793c275861a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_image_backend" ALTER COLUMN "user_id" SET DATA TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" ALTER COLUMN "user_id" SET DATA TYPE character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1a427e855045fa793c275861a" ON "e_usr_preference_backend" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "e_usr_preference_backend" ADD CONSTRAINT "UQ_576678406a479d569123a33e132" UNIQUE ("key", "user_id")`,
    );
  }
}
