import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" ADD COLUMN "film_video_id" integer;
  ALTER TABLE "media" ADD COLUMN "variants_av1_id" integer;
  ALTER TABLE "media" ADD COLUMN "variants_small_id" integer;
  ALTER TABLE "media" ADD COLUMN "variants_uhd_id" integer;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_film_video_id_media_id_fk" FOREIGN KEY ("film_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_variants_av1_id_media_id_fk" FOREIGN KEY ("variants_av1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_variants_small_id_media_id_fk" FOREIGN KEY ("variants_small_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_variants_uhd_id_media_id_fk" FOREIGN KEY ("variants_uhd_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "brands_film_film_video_idx" ON "brands" USING btree ("film_video_id");
  CREATE INDEX "media_variants_variants_av1_idx" ON "media" USING btree ("variants_av1_id");
  CREATE INDEX "media_variants_variants_small_idx" ON "media" USING btree ("variants_small_id");
  CREATE INDEX "media_variants_variants_uhd_idx" ON "media" USING btree ("variants_uhd_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" DROP CONSTRAINT "brands_film_video_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_variants_av1_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_variants_small_id_media_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_variants_uhd_id_media_id_fk";
  
  DROP INDEX "brands_film_film_video_idx";
  DROP INDEX "media_variants_variants_av1_idx";
  DROP INDEX "media_variants_variants_small_idx";
  DROP INDEX "media_variants_variants_uhd_idx";
  ALTER TABLE "brands" DROP COLUMN "film_video_id";
  ALTER TABLE "media" DROP COLUMN "variants_av1_id";
  ALTER TABLE "media" DROP COLUMN "variants_small_id";
  ALTER TABLE "media" DROP COLUMN "variants_uhd_id";`)
}
