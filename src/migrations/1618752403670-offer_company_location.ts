import { MigrationInterface, QueryRunner } from 'typeorm';

export class offerCompanyLocation1618752403670 implements MigrationInterface {
  name = 'offerCompanyLocation1618752403670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offer_locations_company_location" ("offerId" integer NOT NULL, "companyLocationId" integer NOT NULL, CONSTRAINT "PK_4c986c528d7f08c13423afcd223" PRIMARY KEY ("offerId", "companyLocationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36ddce422fb35c58479793c05f" ON "offer_locations_company_location" ("offerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc9be12b020ac3b80024f3937e" ON "offer_locations_company_location" ("companyLocationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_locations_company_location" ADD CONSTRAINT "FK_36ddce422fb35c58479793c05f5" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_locations_company_location" ADD CONSTRAINT "FK_cc9be12b020ac3b80024f3937e6" FOREIGN KEY ("companyLocationId") REFERENCES "company_location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_locations_company_location" DROP CONSTRAINT "FK_cc9be12b020ac3b80024f3937e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_locations_company_location" DROP CONSTRAINT "FK_36ddce422fb35c58479793c05f5"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_cc9be12b020ac3b80024f3937e"`);
    await queryRunner.query(`DROP INDEX "IDX_36ddce422fb35c58479793c05f"`);
    await queryRunner.query(`DROP TABLE "offer_locations_company_location"`);
  }
}
