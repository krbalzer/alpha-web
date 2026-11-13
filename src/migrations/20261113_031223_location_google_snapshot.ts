import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" ADD COLUMN "google_rating" numeric;
  ALTER TABLE "locations" ADD COLUMN "google_count" numeric;
  ALTER TABLE "locations" ADD COLUMN "google_synced_at" timestamp(3) with time zone;
  ALTER TABLE "locations" ADD COLUMN "google_uri" varchar;
  ALTER TABLE "locations" ADD COLUMN "google_reviews" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP COLUMN "google_rating";
  ALTER TABLE "locations" DROP COLUMN "google_count";
  ALTER TABLE "locations" DROP COLUMN "google_synced_at";
  ALTER TABLE "locations" DROP COLUMN "google_uri";
  ALTER TABLE "locations" DROP COLUMN "google_reviews";`)
}
