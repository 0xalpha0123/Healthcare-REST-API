import { MigrationInterface, QueryRunner } from 'typeorm';

interface ProfessionSeederInterface {
  id: Number,
  name: String,
  icon_path: String | null
}

const data: Array<ProfessionSeederInterface> = [
  {
    id: 1,
    name: 'Lekarz',
    icon_path: null
  },
  {
    id: 2,
    name: 'Pielęgniarka',
    icon_path: null
  },
  {
    id: 3,
    name: 'Położna',
    icon_path: null
  },
  {
    id: 4,
    name: 'Fizjoterapeuta',
    icon_path: null
  },
  {
    id: 5,
    name: 'Diagnosta laboratoryjny',
    icon_path: null
  },
  {
    id: 6,
    name: 'Farmaceuta',
    icon_path: null
  },
  {
    id: 7,
    name: 'Inne',
    icon_path: null
  },
];

export class Professions implements MigrationInterface {
  name = 'Professions1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data.map(el => `('${el.id}','${el.name}','${el.icon_path}')`).join(", ");
    await queryRunner.query(`INSERT INTO profession (id, name, icon_path) VALUES ${values};`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE profession`);
  }
}
