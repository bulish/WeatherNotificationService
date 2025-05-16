import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCityTable1747384387671 implements MigrationInterface {
    name = 'CreateCityTable1747384387671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_USERNAME" ON "user" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_USER_EMAIL" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_USERNAME"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
