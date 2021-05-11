import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payment1619554089485 implements MigrationInterface {
  name = 'Payment1619554089485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "crc" character varying NOT NULL, "amount" numeric NOT NULL, "extension_days" integer NOT NULL, "status" character varying NOT NULL, "offer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" DROP CONSTRAINT "FK_16df5caaa09a48a866803e93c66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ALTER COLUMN "company_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ADD CONSTRAINT "FK_16df5caaa09a48a866803e93c66" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_80308d2f56c03f1104d52f289aa" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_80308d2f56c03f1104d52f289aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" DROP CONSTRAINT "FK_16df5caaa09a48a866803e93c66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ALTER COLUMN "company_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ADD CONSTRAINT "FK_16df5caaa09a48a866803e93c66" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
