import { MigrationInterface, QueryRunner } from 'typeorm';

interface SpecializationSeederInterface {
  id: number;
  name: string;
  profession_id: number;
  is_promoted: boolean;
}

const data: Array<SpecializationSeederInterface> = [
  {
    id: 1,
    name: 'Alergologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 2,
    name: 'Chirurgia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 3,
    name: 'Dermatologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 4,
    name: 'Ginekologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 5,
    name: 'Pediatria',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 6,
    name: 'Psychiatria',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 7,
    name: 'Kardiologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 8,
    name: 'Anestezjologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 9,
    name: 'Endokrynologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 10,
    name: 'Neurologia',
    profession_id: 1,
    is_promoted: true,
  },
  {
    id: 11,
    name: 'Operacyjna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 12,
    name: 'Opieka paliatywna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 13,
    name: 'Onkologiczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 14,
    name: 'Chirurgiczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 15,
    name: 'Pediatryczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 16,
    name: 'Internistyczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 17,
    name: 'Anestezjologiczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 18,
    name: 'Epidemiologiczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 19,
    name: 'Psychiatryczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 20,
    name: 'Geriatryczna',
    profession_id: 2,
    is_promoted: true,
  },
  {
    id: 21,
    name: 'Ogólna',
    profession_id: 4,
    is_promoted: true,
  },
  {
    id: 22,
    name: 'Sportowa',
    profession_id: 4,
    is_promoted: true,
  },
  {
    id: 23,
    name: 'Okołooperacyjna',
    profession_id: 4,
    is_promoted: true,
  },
  {
    id: 24,
    name: 'Dziecięca',
    profession_id: 4,
    is_promoted: true,
  },
  {
    id: 25,
    name: 'Ortopedyczna',
    profession_id: 4,
    is_promoted: true,
  },
  {
    id: 26,
    name: 'Genetyka',
    profession_id: 5,
    is_promoted: true,
  },
  {
    id: 27,
    name: 'Toksykologia',
    profession_id: 5,
    is_promoted: true,
  },
  {
    id: 28,
    name: 'Transfuzjologia',
    profession_id: 5,
    is_promoted: true,
  },
  {
    id: 29,
    name: 'Hematologia',
    profession_id: 5,
    is_promoted: true,
  },
  {
    id: 30,
    name: 'Epidemiologia',
    profession_id: 5,
    is_promoted: true,
  },
  {
    id: 31,
    name: 'Analityka',
    profession_id: 6,
    is_promoted: true,
  },
  {
    id: 32,
    name: 'Bromatologia',
    profession_id: 6,
    is_promoted: true,
  },
  {
    id: 33,
    name: 'Kliniczna',
    profession_id: 6,
    is_promoted: true,
  },
  {
    id: 34,
    name: 'Przemysłowa',
    profession_id: 6,
    is_promoted: true,
  },
  {
    id: 35,
    name: 'Szpitalna',
    profession_id: 6,
    is_promoted: true,
  },
];

export class Specializations implements MigrationInterface {
  name = 'Specializations1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data
      .map(
        (el) =>
          `('${el.id}','${el.name}','${el.profession_id}','${el.is_promoted}')`,
      )
      .join(', ');
    await queryRunner.query(
      `INSERT INTO specialization (id, name, profession_id, is_promoted) VALUES ${values};`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE specialization`);
  }
}
