import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyPhoto1617894255755 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_cda7cad80fc363fd735aefa13a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_photo" ADD CONSTRAINT "FK_22684d851cba82c5f117d102ea9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_photo" DROP CONSTRAINT "FK_22684d851cba82c5f117d102ea9"`,
    );
    await queryRunner.query(`DROP TABLE "company_photo"`);
  }
}
