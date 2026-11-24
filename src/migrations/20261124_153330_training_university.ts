import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_training_events_kind" AS ENUM('aim', 'lab');
  CREATE TYPE "public"."enum_training_events_status" AS ENUM('upcoming', 'held', 'cancelled');
  CREATE TYPE "public"."enum_training_events_track" AS ENUM('injector', 'skincare', 'cadaver', 'regional', 'surgical');
  ALTER TYPE "public"."enum_users_roles" ADD VALUE 'university';
  CREATE TABLE "training_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_training_events_kind" DEFAULT 'aim' NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_training_events_status" DEFAULT 'upcoming' NOT NULL,
  	"speaker" varchar,
  	"season" numeric,
  	"topic" varchar,
  	"track" "enum_training_events_track" DEFAULT 'injector',
  	"location_id" integer,
  	"venue" varchar,
  	"city" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"public" boolean DEFAULT true,
  	"note" varchar,
  	"cover_id" integer,
  	"cover_needed" boolean,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "training_events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "university" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"members_injector" numeric,
  	"members_esthie" numeric,
  	"members_manager" numeric,
  	"members_marketing" numeric,
  	"members_surgery" numeric,
  	"members_body" numeric,
  	"support_reply" varchar DEFAULT '< 1 min',
  	"support_solved" varchar DEFAULT '3 days',
  	"vendor_sessions" numeric DEFAULT 18,
  	"practice_faculty" numeric,
  	"show_clinical_director" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "training_events_id" integer;
  ALTER TABLE "training_events" ADD CONSTRAINT "training_events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_events" ADD CONSTRAINT "training_events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_events_rels" ADD CONSTRAINT "training_events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."training_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_events_rels" ADD CONSTRAINT "training_events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "training_events_location_idx" ON "training_events" USING btree ("location_id");
  CREATE INDEX "training_events_cover_idx" ON "training_events" USING btree ("cover_id");
  CREATE INDEX "training_events_updated_at_idx" ON "training_events" USING btree ("updated_at");
  CREATE INDEX "training_events_created_at_idx" ON "training_events" USING btree ("created_at");
  CREATE INDEX "training_events_rels_order_idx" ON "training_events_rels" USING btree ("order");
  CREATE INDEX "training_events_rels_parent_idx" ON "training_events_rels" USING btree ("parent_id");
  CREATE INDEX "training_events_rels_path_idx" ON "training_events_rels" USING btree ("path");
  CREATE INDEX "training_events_rels_media_id_idx" ON "training_events_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_events_fk" FOREIGN KEY ("training_events_id") REFERENCES "public"."training_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_training_events_id_idx" ON "payload_locked_documents_rels" USING btree ("training_events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "training_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "university" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "training_events" CASCADE;
  DROP TABLE "training_events_rels" CASCADE;
  DROP TABLE "university" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_training_events_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'partnerships', 'contributor');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "payload_locked_documents_rels_training_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "training_events_id";
  DROP TYPE "public"."enum_training_events_kind";
  DROP TYPE "public"."enum_training_events_status";
  DROP TYPE "public"."enum_training_events_track";`)
}
