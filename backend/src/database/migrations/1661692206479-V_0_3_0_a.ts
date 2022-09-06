import { MigrationInterface, QueryRunner } from 'typeorm';

export class V030A1661692206479 implements MigrationInterface {
  name = 'V030A1661692206479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "e_image_derivative_backend" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_id" character varying NOT NULL, "key" character varying NOT NULL, "filetype" character varying NOT NULL, "last_read" TIMESTAMP NOT NULL, "data" bytea NOT NULL, CONSTRAINT "UQ_fa03f5333afd74c5cc5ff780d75" UNIQUE ("image_id", "key"), CONSTRAINT "PK_ff1ecff935b8d7bdcea89087810" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37055605f39b3f8847232d604f" ON "e_image_derivative_backend" ("image_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7dc534a666f442383341896062" ON "e_image_derivative_backend" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "e_image_file_backend" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image_id" character varying NOT NULL, "variant" character varying NOT NULL, "filetype" character varying NOT NULL, "data" bytea NOT NULL, CONSTRAINT "UQ_872384f20feaf7bfd27e28b8d4a" UNIQUE ("image_id", "variant"), CONSTRAINT "PK_95953be58a506e5de46feec6186" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8055f37d3b9f52f421b94ee84d" ON "e_image_file_backend" ("image_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0500b00b0b4109b623f897c2d" ON "e_image_file_backend" ("variant") `,
    );
    await queryRunner.query(
      `CREATE TABLE "e_image_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "created" TIMESTAMP NOT NULL, CONSTRAINT "PK_5f7993001a7c82564ec5300540d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "e_role_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "permissions" text array NOT NULL, CONSTRAINT "UQ_cbedb9f42a98a82d91422e7fedf" UNIQUE ("name"), CONSTRAINT "PK_af7ba6a46bf69a7b10c425f0367" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cbedb9f42a98a82d91422e7fed" ON "e_role_backend" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "e_sys_preference_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "UQ_b04e47c4814fb6e315c5879fa75" UNIQUE ("key"), CONSTRAINT "PK_b79f051e19b46e74cf255e9ba3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b04e47c4814fb6e315c5879fa7" ON "e_sys_preference_backend" ("key") `,
    );
    await queryRunner.query(
      `CREATE TABLE "e_user_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "roles" text array NOT NULL, "hashed_password" character varying NOT NULL, CONSTRAINT "UQ_ae538430fd08b28f4ab297eff09" UNIQUE ("username"), CONSTRAINT "PK_0b9d256d52e55a48d32e8b64d96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae538430fd08b28f4ab297eff0" ON "e_user_backend" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "e_usr_preference_backend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "UQ_576678406a479d569123a33e132" UNIQUE ("key", "user_id"), CONSTRAINT "PK_8f8251016cd9283e7eb04c5498b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_673fe530e2484ff7e31ac81099" ON "e_usr_preference_backend" ("key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f1a427e855045fa793c275861a" ON "e_usr_preference_backend" ("user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f1a427e855045fa793c275861a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_673fe530e2484ff7e31ac81099"`,
    );
    await queryRunner.query(`DROP TABLE "e_usr_preference_backend"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae538430fd08b28f4ab297eff0"`,
    );
    await queryRunner.query(`DROP TABLE "e_user_backend"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b04e47c4814fb6e315c5879fa7"`,
    );
    await queryRunner.query(`DROP TABLE "e_sys_preference_backend"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cbedb9f42a98a82d91422e7fed"`,
    );
    await queryRunner.query(`DROP TABLE "e_role_backend"`);
    await queryRunner.query(`DROP TABLE "e_image_backend"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0500b00b0b4109b623f897c2d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8055f37d3b9f52f421b94ee84d"`,
    );
    await queryRunner.query(`DROP TABLE "e_image_file_backend"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7dc534a666f442383341896062"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_37055605f39b3f8847232d604f"`,
    );
    await queryRunner.query(`DROP TABLE "e_image_derivative_backend"`);
  }
}
