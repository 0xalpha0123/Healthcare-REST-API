import {MigrationInterface, QueryRunner} from "typeorm";

export class Offer1618338258067 implements MigrationInterface {
    name = 'Offer1618338258067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agreement_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4264e2a1b1ee8a896c7e66774a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "specialization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "profession_id" integer NOT NULL, CONSTRAINT "PK_904dfcbdb57f56f5b57b9c09cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profession" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7a54f88e18eaeb628aef171dc52" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offer" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "salary_from" integer NOT NULL, "salary_to" integer NOT NULL, "paid_till" TIMESTAMP NOT NULL, "active" boolean NOT NULL DEFAULT false, "agreement_type_id" integer, "profession_id" integer, "specialization_id" integer, "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "specializtion_id" integer, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_photo" DROP CONSTRAINT "FK_22684d851cba82c5f117d102ea9"`);
        await queryRunner.query(`ALTER TABLE "company_photo" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_photo" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_photo" ADD CONSTRAINT "FK_22684d851cba82c5f117d102ea9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "specialization" ADD CONSTRAINT "FK_ce8be105b8c2d325b396d5b8a81" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a" FOREIGN KEY ("agreement_type_id") REFERENCES "agreement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2a510e6347bd21f96917fcaf439" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_0f7e1506af0637261e679ba77d3" FOREIGN KEY ("specializtion_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_7d1cbe435c8a0ff1e35adca2832" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_7d1cbe435c8a0ff1e35adca2832"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_0f7e1506af0637261e679ba77d3"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2a510e6347bd21f96917fcaf439"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a"`);
        await queryRunner.query(`ALTER TABLE "specialization" DROP CONSTRAINT "FK_ce8be105b8c2d325b396d5b8a81"`);
        await queryRunner.query(`ALTER TABLE "company_photo" DROP CONSTRAINT "FK_22684d851cba82c5f117d102ea9"`);
        await queryRunner.query(`ALTER TABLE "company_photo" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_photo" ALTER COLUMN "company_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company_photo" ADD CONSTRAINT "FK_22684d851cba82c5f117d102ea9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "offer"`);
        await queryRunner.query(`DROP TABLE "profession"`);
        await queryRunner.query(`DROP TABLE "specialization"`);
        await queryRunner.query(`DROP TABLE "agreement_type"`);
    }

}
