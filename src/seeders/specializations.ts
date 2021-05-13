import { MigrationInterface, QueryRunner } from 'typeorm';

interface SpecializationSeederInterface {
  id: number;
  name: string;
  profession_id: number;
}

const data: Array<SpecializationSeederInterface> = [
  {
    id: 1,
    name: 'Alergologia',
    profession_id: 1,
  },
  {
    id: 2,
    name: 'Chirurgia',
    profession_id: 1,
  },
  {
    id: 3,
    name: 'Dermatologia',
    profession_id: 1,
  },
  {
    id: 4,
    name: 'Ginekologia',
    profession_id: 1,
  },
  {
    id: 5,
    name: 'Pediatria',
    profession_id: 1,
  },
  {
    id: 6,
    name: 'Psychiatria',
    profession_id: 1,
  },
  {
    id: 7,
    name: 'Kardiologia',
    profession_id: 1,
  },
  {
    id: 8,
    name: 'Anestezjologia',
    profession_id: 1,
  },
  {
    id: 9,
    name: 'Endokrynologia',
    profession_id: 1,
  },
  {
    id: 10,
    name: 'Neurologia',
    profession_id: 1,
  },
  {
    id: 11,
    name: 'Operacyjna',
    profession_id: 2,
  },
  {
    id: 12,
    name: 'Opieka paliatywna',
    profession_id: 2,
  },
  {
    id: 13,
    name: 'Onkologiczna',
    profession_id: 2,
  },
  {
    id: 14,
    name: 'Chirurgiczna',
    profession_id: 2,
  },
  {
    id: 15,
    name: 'Pediatryczna',
    profession_id: 2,
  },
  {
    id: 16,
    name: 'Internistyczna',
    profession_id: 2,
  },
  {
    id: 17,
    name: 'Anestezjologiczna',
    profession_id: 2,
  },
  {
    id: 18,
    name: 'Epidemiologiczna',
    profession_id: 2,
  },
  {
    id: 19,
    name: 'Psychiatryczna',
    profession_id: 2,
  },
  {
    id: 20,
    name: 'Geriatryczna',
    profession_id: 2,
  },
  {
    id: 21,
    name: 'Ogólna',
    profession_id: 4,
  },
  {
    id: 22,
    name: 'Sportowa',
    profession_id: 4,
  },
  {
    id: 23,
    name: 'Okołooperacyjna',
    profession_id: 4,
  },
  {
    id: 24,
    name: 'Dziecięca',
    profession_id: 4,
  },
  {
    id: 25,
    name: 'Ortopedyczna',
    profession_id: 4,
  },
  {
    id: 26,
    name: 'Genetyka',
    profession_id: 5,
  },
  {
    id: 27,
    name: 'Toksykologia',
    profession_id: 5,
  },
  {
    id: 28,
    name: 'Transfuzjologia',
    profession_id: 5,
  },
  {
    id: 29,
    name: 'Hematologia',
    profession_id: 5,
  },
  {
    id: 30,
    name: 'Epidemiologia',
    profession_id: 5,
  },
  {
    id: 31,
    name: 'Analityka',
    profession_id: 6,
  },
  {
    id: 32,
    name: 'Bromatologia',
    profession_id: 6,
  },
  {
    id: 33,
    name: 'Kliniczna',
    profession_id: 6,
  },
  {
    id: 34,
    name: 'Przemysłowa',
    profession_id: 6,
  },
  {
    id: 35,
    name: 'Szpitalna',
    profession_id: 6,
  },
];

export class Specializations implements MigrationInterface {
  name = 'Specializations1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data
      .map(
        (el) =>
          `('${el.id}','${el.name}','${el.profession_id}')`,
      )
      .join(', ');
    await queryRunner.query(
      `INSERT INTO specialization (id, name, profession_id) VALUES ${values};`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE specialization`);
  }
}
