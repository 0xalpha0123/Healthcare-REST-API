import { MigrationInterface, QueryRunner } from 'typeorm';

interface AgreementTypeSeederInterface {
  id: Number,
  name: String,
}

const data: Array<AgreementTypeSeederInterface> = [
  {
    id: 1,
    name: 'UoP',
  },
  {
    id: 2,
    name: 'UZ',
  },
  {
    id: 3,
    name: 'Kontrakt',
  },
];

export class AgreementTypes implements MigrationInterface {
  name = 'AgreementTypes1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data.map(el => `('${el.id}','${el.name}')`).join(", ");
    await queryRunner.query(`INSERT INTO agreement_type (id, name) VALUES ${values};`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE agreement_type`);
  }
}
