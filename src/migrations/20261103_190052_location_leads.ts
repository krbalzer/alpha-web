import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "locations_role_mix" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"count" numeric NOT NULL
  );
  
  ALTER TABLE "locations_providers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations_providers" CASCADE;
  ALTER TABLE "locations" ADD COLUMN "lead_name" varchar;
  ALTER TABLE "locations" ADD COLUMN "lead_credentials" varchar;
  ALTER TABLE "locations" ADD COLUMN "lead_title" varchar;
  ALTER TABLE "locations" ADD COLUMN "lead_photo_id" integer;
  ALTER TABLE "locations" ADD COLUMN "lead_profile_id" integer;
  ALTER TABLE "locations_role_mix" ADD CONSTRAINT "locations_role_mix_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locations_role_mix_order_idx" ON "locations_role_mix" USING btree ("_order");
  CREATE INDEX "locations_role_mix_parent_id_idx" ON "locations_role_mix" USING btree ("_parent_id");
  ALTER TABLE "locations" ADD CONSTRAINT "locations_lead_photo_id_media_id_fk" FOREIGN KEY ("lead_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_lead_profile_id_founders_id_fk" FOREIGN KEY ("lead_profile_id") REFERENCES "public"."founders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "locations_lead_lead_photo_idx" ON "locations" USING btree ("lead_photo_id");
  CREATE INDEX "locations_lead_lead_profile_idx" ON "locations" USING btree ("lead_profile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "locations_providers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"photo_id" integer
  );
  
  ALTER TABLE "locations_role_mix" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "locations_role_mix" CASCADE;
  ALTER TABLE "locations" DROP CONSTRAINT "locations_lead_photo_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_lead_profile_id_founders_id_fk";
  
  DROP INDEX "locations_lead_lead_photo_idx";
  DROP INDEX "locations_lead_lead_profile_idx";
  ALTER TABLE "locations_providers" ADD CONSTRAINT "locations_providers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_providers" ADD CONSTRAINT "locations_providers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locations_providers_order_idx" ON "locations_providers" USING btree ("_order");
  CREATE INDEX "locations_providers_parent_id_idx" ON "locations_providers" USING btree ("_parent_id");
  CREATE INDEX "locations_providers_photo_idx" ON "locations_providers" USING btree ("photo_id");
  ALTER TABLE "locations" DROP COLUMN "lead_name";
  ALTER TABLE "locations" DROP COLUMN "lead_credentials";
  ALTER TABLE "locations" DROP COLUMN "lead_title";
  ALTER TABLE "locations" DROP COLUMN "lead_photo_id";
  ALTER TABLE "locations" DROP COLUMN "lead_profile_id";`)
}
