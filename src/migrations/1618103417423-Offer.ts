import { MigrationInterface, QueryRunner } from 'typeorm';

export class Offer1618103417423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offer" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" TEXT, "salary_from" INTEGER, "salary_to" INTEGER, "paid_till" DATE NOT NULL, "active" BOOLEAN NOT NULL DEFAULT false, profession_id INTEGER NOT NULL, "specialization_id" INTEGER NOT NULL, "company_id" INTEGER NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "offer"`);
  }
}
