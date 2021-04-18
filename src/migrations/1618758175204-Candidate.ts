import {MigrationInterface, QueryRunner} from "typeorm";

export class Candidate1618758175204 implements MigrationInterface {
    name = 'Candidate1618758175204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candidate" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "message" character varying, "cv_file_path" character varying NOT NULL, "offer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_833cb15525f795fa076cd29bc2e" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_833cb15525f795fa076cd29bc2e"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
    }

}
