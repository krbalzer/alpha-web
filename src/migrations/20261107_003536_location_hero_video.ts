import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ADD COLUMN "hero_video_id" integer;
  ALTER TABLE "locations" ADD COLUMN "hero_poster_id" integer;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "locations_hero_video_idx" ON "locations" USING btree ("hero_video_id");
  CREATE INDEX "locations_hero_poster_idx" ON "locations" USING btree ("hero_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP CONSTRAINT "locations_hero_video_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_hero_poster_id_media_id_fk";
  
  DROP INDEX "locations_hero_video_idx";
  DROP INDEX "locations_hero_poster_idx";
  ALTER TABLE "locations" DROP COLUMN "hero_video_id";
  ALTER TABLE "locations" DROP COLUMN "hero_poster_id";`)
}
