import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_origin" AS ENUM('original', 'tuck-in', 'de-novo');
  CREATE TYPE "public"."enum_tuck_ins_kind" AS ENUM('location', 'merged');
  CREATE TYPE "public"."enum_founders_kind" AS ENUM('provider', 'business');
  CREATE TYPE "public"."enum_founders_status" AS ENUM('active', 'former');
  CREATE TABLE "tuck_ins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"former_name" varchar NOT NULL,
  	"brand_id" integer NOT NULL,
  	"closed" timestamp(3) with time zone,
  	"kind" "enum_tuck_ins_kind" DEFAULT 'location' NOT NULL,
  	"location_id" integer,
  	"city" varchar,
  	"state" varchar,
  	"story" jsonb,
  	"film" varchar,
  	"quote_text" varchar,
  	"quote_source" varchar,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tuck_ins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"founders_id" integer
  );
  
  CREATE TABLE "network_suppressed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  ALTER TABLE "brands" ADD COLUMN "announced" boolean DEFAULT true;
  ALTER TABLE "locations" ADD COLUMN "origin" "enum_locations_origin" DEFAULT 'original';
  ALTER TABLE "locations" ADD COLUMN "opened" timestamp(3) with time zone;
  ALTER TABLE "locations" ADD COLUMN "former_name" varchar;
  ALTER TABLE "founders" ADD COLUMN "kind" "enum_founders_kind" DEFAULT 'provider';
  ALTER TABLE "founders" ADD COLUMN "status" "enum_founders_status" DEFAULT 'active';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tuck_ins_id" integer;
  ALTER TABLE "tuck_ins" ADD CONSTRAINT "tuck_ins_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tuck_ins" ADD CONSTRAINT "tuck_ins_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tuck_ins_rels" ADD CONSTRAINT "tuck_ins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tuck_ins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tuck_ins_rels" ADD CONSTRAINT "tuck_ins_rels_founders_fk" FOREIGN KEY ("founders_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "network_suppressed" ADD CONSTRAINT "network_suppressed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."network"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tuck_ins_brand_idx" ON "tuck_ins" USING btree ("brand_id");
  CREATE INDEX "tuck_ins_location_idx" ON "tuck_ins" USING btree ("location_id");
  CREATE UNIQUE INDEX "tuck_ins_slug_idx" ON "tuck_ins" USING btree ("slug");
  CREATE INDEX "tuck_ins_updated_at_idx" ON "tuck_ins" USING btree ("updated_at");
  CREATE INDEX "tuck_ins_created_at_idx" ON "tuck_ins" USING btree ("created_at");
  CREATE INDEX "tuck_ins_rels_order_idx" ON "tuck_ins_rels" USING btree ("order");
  CREATE INDEX "tuck_ins_rels_parent_idx" ON "tuck_ins_rels" USING btree ("parent_id");
  CREATE INDEX "tuck_ins_rels_path_idx" ON "tuck_ins_rels" USING btree ("path");
  CREATE INDEX "tuck_ins_rels_founders_id_idx" ON "tuck_ins_rels" USING btree ("founders_id");
  CREATE INDEX "network_suppressed_order_idx" ON "network_suppressed" USING btree ("_order");
  CREATE INDEX "network_suppressed_parent_id_idx" ON "network_suppressed" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tuck_ins_fk" FOREIGN KEY ("tuck_ins_id") REFERENCES "public"."tuck_ins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_tuck_ins_id_idx" ON "payload_locked_documents_rels" USING btree ("tuck_ins_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tuck_ins" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tuck_ins_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "network_suppressed" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tuck_ins" CASCADE;
  DROP TABLE "tuck_ins_rels" CASCADE;
  DROP TABLE "network_suppressed" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tuck_ins_fk";
  
  DROP INDEX "payload_locked_documents_rels_tuck_ins_id_idx";
  ALTER TABLE "brands" DROP COLUMN "announced";
  ALTER TABLE "locations" DROP COLUMN "origin";
  ALTER TABLE "locations" DROP COLUMN "opened";
  ALTER TABLE "locations" DROP COLUMN "former_name";
  ALTER TABLE "founders" DROP COLUMN "kind";
  ALTER TABLE "founders" DROP COLUMN "status";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tuck_ins_id";
  DROP TYPE "public"."enum_locations_origin";
  DROP TYPE "public"."enum_tuck_ins_kind";
  DROP TYPE "public"."enum_founders_kind";
  DROP TYPE "public"."enum_founders_status";`)
}
