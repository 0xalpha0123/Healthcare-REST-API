import {MigrationInterface, QueryRunner} from "typeorm";

export class update1618664715643 implements MigrationInterface {
    name = 'update1618664715643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_0f7e1506af0637261e679ba77d3"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "specializtion_id"`);
        await queryRunner.query(`ALTER TABLE "specialization" ADD "is_promoted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "specialization" ADD "icon_path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profession" ADD "icon_path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2a510e6347bd21f96917fcaf439"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "agreement_type_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "profession_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "specialization_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a" FOREIGN KEY ("agreement_type_id") REFERENCES "agreement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2a510e6347bd21f96917fcaf439" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7" FOREIGN KEY ("specialization_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2a510e6347bd21f96917fcaf439"`);
        await queryRunner.query(`ALTER TABLE "offer" DROP CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a"`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "specialization_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "profession_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ALTER COLUMN "agreement_type_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2a510e6347bd21f96917fcaf439" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_2bbee5a89ba940a55dedb4ace0a" FOREIGN KEY ("agreement_type_id") REFERENCES "agreement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profession" DROP COLUMN "icon_path"`);
        await queryRunner.query(`ALTER TABLE "specialization" DROP COLUMN "icon_path"`);
        await queryRunner.query(`ALTER TABLE "specialization" DROP COLUMN "is_promoted"`);
        await queryRunner.query(`ALTER TABLE "offer" ADD "specializtion_id" integer`);
        await queryRunner.query(`ALTER TABLE "offer" ADD CONSTRAINT "FK_0f7e1506af0637261e679ba77d3" FOREIGN KEY ("specializtion_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
