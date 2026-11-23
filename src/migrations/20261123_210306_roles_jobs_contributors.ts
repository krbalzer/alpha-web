import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_status" AS ENUM('open', 'filled');
  CREATE TYPE "public"."enum_media_kind" AS ENUM('practice', 'experience', 'why-alpha', 'milestone', 'cta', 'arrival', 'rebrand-identity', 'rebrand-application', 'headshot');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'partnerships', 'contributor');
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"brand_id" integer,
  	"location_id" integer,
  	"paylocity_location" varchar,
  	"remote" boolean,
  	"description" varchar,
  	"apply_url" varchar NOT NULL,
  	"status" "enum_jobs_status" DEFAULT 'open' NOT NULL,
  	"hidden" boolean,
  	"posted" timestamp(3) with time zone,
  	"paylocity_id" varchar,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media_kind" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_media_kind",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "locations_milestones" ADD COLUMN "source" varchar;
  ALTER TABLE "locations" ADD COLUMN "paylocity_name" varchar;
  ALTER TABLE "episodes" ADD COLUMN "transcript_raw" varchar;
  ALTER TABLE "media" ADD COLUMN "brand_id" integer;
  ALTER TABLE "media" ADD COLUMN "location_id" integer;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "jobs_id" integer;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_kind" ADD CONSTRAINT "media_kind_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "jobs_brand_idx" ON "jobs" USING btree ("brand_id");
  CREATE INDEX "jobs_location_idx" ON "jobs" USING btree ("location_id");
  CREATE UNIQUE INDEX "jobs_paylocity_id_idx" ON "jobs" USING btree ("paylocity_id");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE INDEX "media_kind_order_idx" ON "media_kind" USING btree ("order");
  CREATE INDEX "media_kind_parent_idx" ON "media_kind" USING btree ("parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  ALTER TABLE "media" ADD CONSTRAINT "media_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_brand_idx" ON "media" USING btree ("brand_id");
  CREATE INDEX "media_location_idx" ON "media" USING btree ("location_id");
  CREATE INDEX "media_created_by_idx" ON "media" USING btree ("created_by_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");`)
  // Everyone who could log in before roles existed had full access. Keep it that way: existing users become admins.
  await db.execute(sql`INSERT INTO "users_roles" ("order", "parent_id", "value") SELECT 1, "id", 'admin' FROM "users";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_kind" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "media_kind" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_brand_id_brands_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_location_id_locations_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT IF EXISTS "media_created_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_jobs_fk";
  
  DROP INDEX IF EXISTS "media_brand_idx";
  DROP INDEX IF EXISTS "media_location_idx";
  DROP INDEX IF EXISTS "media_created_by_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_jobs_id_idx";
  ALTER TABLE "locations_milestones" DROP COLUMN "source";
  ALTER TABLE "locations" DROP COLUMN "paylocity_name";
  ALTER TABLE "episodes" DROP COLUMN "transcript_raw";
  ALTER TABLE "media" DROP COLUMN "brand_id";
  ALTER TABLE "media" DROP COLUMN "location_id";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "created_by_id";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "jobs_id";
  DROP TYPE "public"."enum_jobs_status";
  DROP TYPE "public"."enum_media_kind";
  DROP TYPE "public"."enum_users_roles";`)
}
