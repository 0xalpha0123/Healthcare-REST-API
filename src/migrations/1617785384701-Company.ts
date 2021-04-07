import {MigrationInterface, QueryRunner} from "typeorm";

export class Company1617785384701 implements MigrationInterface {
    name = 'Company1617785384701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company_photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_path" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_cda7cad80fc363fd735aefa13a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_location" ("id" SERIAL NOT NULL, "name" character varying, "coordinates" point NOT NULL, "city" character varying NOT NULL, "postcode" character varying NOT NULL, "street" character varying NOT NULL, "building_number" integer NOT NULL, "room_number" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_39a451be6bac0920c6199716a6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "logo_file_path" character varying, "website_url" character varying, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_879141ebc259b4c0544b3f1ea4" UNIQUE ("user_id"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company_photo" ADD CONSTRAINT "FK_22684d851cba82c5f117d102ea9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_location" ADD CONSTRAINT "FK_16df5caaa09a48a866803e93c66" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`);
        await queryRunner.query(`ALTER TABLE "company_location" DROP CONSTRAINT "FK_16df5caaa09a48a866803e93c66"`);
        await queryRunner.query(`ALTER TABLE "company_photo" DROP CONSTRAINT "FK_22684d851cba82c5f117d102ea9"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "company_location"`);
        await queryRunner.query(`DROP TABLE "company_photo"`);
    }

}
