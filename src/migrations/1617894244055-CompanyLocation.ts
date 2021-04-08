import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyLocation1617894244055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company_location" ("id" SERIAL NOT NULL, "name" character varying, "coordinates" point NOT NULL, "city" character varying NOT NULL, "postcode" character varying NOT NULL, "street" character varying NOT NULL, "building_number" integer NOT NULL, "room_number" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_39a451be6bac0920c6199716a6c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ADD CONSTRAINT "FK_16df5caaa09a48a866803e93c66" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company_location" DROP CONSTRAINT "FK_16df5caaa09a48a866803e93c66"`,
    );
    await queryRunner.query(`DROP TABLE "company_location"`);
  }
}
