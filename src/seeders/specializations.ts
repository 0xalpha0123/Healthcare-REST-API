import { MigrationInterface, QueryRunner } from 'typeorm';

interface SpecializationSeederInterface {
  id: Number,
  name: String,
  icon_path: String | null,
  profession_id: Number,
  is_promoted: Boolean,
}

const data: Array<SpecializationSeederInterface> = [
  {
   id: 1,
  name: 'Alergologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 2,
  name: 'Chirurgia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 3,
  name: 'Dermatologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 4,
  name: 'Ginekologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 5,
  name: 'Pediatria',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 6,
  name: 'Psychiatria',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 7,
  name: 'Kardiologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 8,
  name: 'Anestezjologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 9,
  name: 'Endokrynologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 10,
  name: 'Neurologia',
  profession_id: 1,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 11,
  name: 'Operacyjna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 12,
  name: 'Opieka paliatywna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 13,
  name: 'Onkologiczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 14,
  name: 'Chirurgiczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 15,
  name: 'Pediatryczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 16,
  name: 'Internistyczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 17,
  name: 'Anestezjologiczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 18,
  name: 'Epidemiologiczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 19,
  name: 'Psychiatryczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 20,
  name: 'Geriatryczna',
  profession_id: 2,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 21,
  name: 'Ogólna',
  profession_id: 4,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 22,
  name: 'Sportowa',
  profession_id: 4,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 23,
  name: 'Okołooperacyjna',
  profession_id: 4,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 24,
  name: 'Dziecięca',
  profession_id: 4,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 25,
  name: 'Ortopedyczna',
  profession_id: 4,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 26,
  name: 'Genetyka',
  profession_id: 5,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 27,
  name: 'Toksykologia',
  profession_id: 5,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 28,
  name: 'Transfuzjologia',
  profession_id: 5,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 29,
  name: 'Hematologia',
  profession_id: 5,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 30,
  name: 'Epidemiologia',
  profession_id: 5,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 31,
  name: 'Analityka',
  profession_id: 6,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 32,
  name: 'Bromatologia',
  profession_id: 6,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 33,
  name: 'Kliniczna',
  profession_id: 6,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 34,
  name: 'Przemysłowa',
  profession_id: 6,
  is_promoted: true,
  icon_path: null,
  },
  {
   id: 35,
  name: 'Szpitalna',
  profession_id: 6,
  is_promoted: true,
  icon_path: null,
  },

];

export class Specializations implements MigrationInterface {
  name = 'Specializations1618338258067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = data.map(el => `('${el.id}','${el.name}','${el.profession_id}','${el.is_promoted}','${el.icon_path}')`).join(", ");
    await queryRunner.query(`INSERT INTO specialization (id, name, profession_id, is_promoted, icon_path) VALUES ${values};`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE specialization`);
  }
}
