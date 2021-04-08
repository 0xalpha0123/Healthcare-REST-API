import { MigrationInterface, QueryRunner } from 'typeorm';

export class Company1617785384701 implements MigrationInterface {
  name = 'Company1617785384701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "logo_file_path" character varying, "website_url" character varying, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_879141ebc259b4c0544b3f1ea4" UNIQUE ("user_id"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`,
    );
    await queryRunner.query(`DROP TABLE "company"`);
  }
}
