import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1620842134193 implements MigrationInterface {
  name = 'Init1620842134193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "verification_token" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_photo" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "file_path" character varying NOT NULL, "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cda7cad80fc363fd735aefa13a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_location" ("id" SERIAL NOT NULL, "name" character varying, "coordinates" point NOT NULL, "city" character varying NOT NULL, "postcode" character varying NOT NULL, "street" character varying NOT NULL, "building_number" integer NOT NULL, "room_number" integer, "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_39a451be6bac0920c6199716a6c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "logo_file_path" character varying, "website_url" character varying, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_879141ebc259b4c0544b3f1ea4" UNIQUE ("user_id"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "crc" character varying NOT NULL, "amount" money NOT NULL, "extension_days" integer NOT NULL, "status" character varying NOT NULL, "offer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agreement_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4264e2a1b1ee8a896c7e66774a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "specialization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "profession_id" integer NOT NULL, "is_promoted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_904dfcbdb57f56f5b57b9c09cc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profession" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7a54f88e18eaeb628aef171dc52" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offer" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "salary_from" integer, "salary_to" integer, "paid_till" TIMESTAMP, "active" boolean NOT NULL DEFAULT false, "profession_id" integer NOT NULL, "specialization_id" integer, "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "candidate" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "message" character varying, "cv_file_path" character varying NOT NULL, "offer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offer_agreement_types_agreement_type" ("offerId" integer NOT NULL, "agreementTypeId" integer NOT NULL, CONSTRAINT "PK_f8d7230b94f6f7584d64c268bb8" PRIMARY KEY ("offerId", "agreementTypeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73ce88dd0fea0a6fd3f74b8b49" ON "offer_agreement_types_agreement_type" ("offerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfb6ca5528110f809e0248aa49" ON "offer_agreement_types_agreement_type" ("agreementTypeId") `,
    );
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
      `ALTER TABLE "company_photo" ADD CONSTRAINT "FK_22684d851cba82c5f117d102ea9" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" ADD CONSTRAINT "FK_16df5caaa09a48a866803e93c66" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_80308d2f56c03f1104d52f289aa" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialization" ADD CONSTRAINT "FK_ce8be105b8c2d325b396d5b8a81" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7" FOREIGN KEY ("specialization_id") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_2a510e6347bd21f96917fcaf439" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" ADD CONSTRAINT "FK_7d1cbe435c8a0ff1e35adca2832" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_833cb15525f795fa076cd29bc2e" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_agreement_types_agreement_type" ADD CONSTRAINT "FK_73ce88dd0fea0a6fd3f74b8b493" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_agreement_types_agreement_type" ADD CONSTRAINT "FK_dfb6ca5528110f809e0248aa497" FOREIGN KEY ("agreementTypeId") REFERENCES "agreement_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
    await queryRunner.query(
      `ALTER TABLE "offer_agreement_types_agreement_type" DROP CONSTRAINT "FK_dfb6ca5528110f809e0248aa497"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_agreement_types_agreement_type" DROP CONSTRAINT "FK_73ce88dd0fea0a6fd3f74b8b493"`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" DROP CONSTRAINT "FK_833cb15525f795fa076cd29bc2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_7d1cbe435c8a0ff1e35adca2832"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_2a510e6347bd21f96917fcaf439"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer" DROP CONSTRAINT "FK_8acdf035a05826e5b4491cc08d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialization" DROP CONSTRAINT "FK_ce8be105b8c2d325b396d5b8a81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_80308d2f56c03f1104d52f289aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_location" DROP CONSTRAINT "FK_16df5caaa09a48a866803e93c66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_photo" DROP CONSTRAINT "FK_22684d851cba82c5f117d102ea9"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_cc9be12b020ac3b80024f3937e"`);
    await queryRunner.query(`DROP INDEX "IDX_36ddce422fb35c58479793c05f"`);
    await queryRunner.query(`DROP TABLE "offer_locations_company_location"`);
    await queryRunner.query(`DROP INDEX "IDX_dfb6ca5528110f809e0248aa49"`);
    await queryRunner.query(`DROP INDEX "IDX_73ce88dd0fea0a6fd3f74b8b49"`);
    await queryRunner.query(
      `DROP TABLE "offer_agreement_types_agreement_type"`,
    );
    await queryRunner.query(`DROP TABLE "candidate"`);
    await queryRunner.query(`DROP TABLE "offer"`);
    await queryRunner.query(`DROP TABLE "profession"`);
    await queryRunner.query(`DROP TABLE "specialization"`);
    await queryRunner.query(`DROP TABLE "agreement_type"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "company_location"`);
    await queryRunner.query(`DROP TABLE "company_photo"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
