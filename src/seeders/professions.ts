import { MigrationInterface, QueryRunner } from 'typeorm';

interface ProfessionSeederInterface {
  id: number;
  name: string;
}

const data: Array<ProfessionSeederInterface> = [
  {
    id: 1,
    name: 'Lekarz',
  },
  {
    id: 2,
    name: 'Pielęgniarka',
  },
  {
    id: 3,
    name: 'Położna',
  },
  {
    id: 4,
    name: 'Fizjoterapeuta',
  },
  {
    id: 5,
    name: 'Diagnosta laboratoryjny',
  },
  {
    id: 6,
    name: 'Farmaceuta',
  },
  {
    id: 7,
    name: 'Inne',
  },
];

export class Professions implements MigrationInterface {
  name = 'Professions1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data.map((el) => `('${el.id}','${el.name}')`).join(', ');
    await queryRunner.query(
      `INSERT INTO profession (id, name) VALUES ${values};`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE profession`);
  }
}
