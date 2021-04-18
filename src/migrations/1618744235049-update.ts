import {MigrationInterface, QueryRunner} from "typeorm";

export class update1618744235049 implements MigrationInterface {
    name = 'update1618744235049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a"`);
        await queryRunner.query(`CREATE TABLE "offer_agreement_types_agreement_type" ("offerId" integer NOT NULL, "agreementTypeId" integer NOT NULL, CONSTRAINT "PK_f8d7230b94f6f7584d64c268bb8" PRIMARY KEY ("offerId", "agreementTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_73ce88dd0fea0a6fd3f74b8b49" ON "offer_agreement_types_agreement_type" ("offerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dfb6ca5528110f809e0248aa49" ON "offer_agreement_types_agreement_type" ("agreementTypeId") `);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "agreement_type_id"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "salary_from" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "salary_to" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "paid_till" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "specialization_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7" FOREIGN KEY ("specialization_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer_agreement_types_agreement_type" ADD CONSTRAINT "FK_73ce88dd0fea0a6fd3f74b8b493" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer_agreement_types_agreement_type" ADD CONSTRAINT "FK_dfb6ca5528110f809e0248aa497" FOREIGN KEY ("agreementTypeId") REFERENCES "agreement_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_agreement_types_agreement_type" DROP CONSTRAINT "FK_dfb6ca5528110f809e0248aa497"`);
        await queryRunner.query(`ALTER TABLE "offer_agreement_types_agreement_type" DROP CONSTRAINT "FK_73ce88dd0fea0a6fd3f74b8b493"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "specialization_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "paid_till" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "salary_to" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "salary_from" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7" FOREIGN KEY ("specialization_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "agreement_type_id" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "IDX_dfb6ca5528110f809e0248aa49"`);
        await queryRunner.query(`DROP INDEX "IDX_73ce88dd0fea0a6fd3f74b8b49"`);
        await queryRunner.query(`DROP TABLE "offer_agreement_types_agreement_type"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a" FOREIGN KEY ("agreement_type_id") REFERENCES "agreement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
