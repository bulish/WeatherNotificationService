import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueContraints1747384582427 implements MigrationInterface {
    name = 'AddUniqueContraints1747384582427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CITY_NAME" ON "city" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_CITY_NAME"`);
    }

}
