import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_stage" AS ENUM('intro', 'nda', 'visit', 'loi', 'close');
  CREATE TYPE "public"."enum_lead_files_report" AS ENUM('pl', 'prov', 'svc', 'payroll', 'dist', 'bs');
  CREATE TYPE "public"."enum_lead_files_status" AS ENUM('review', 'ok', 'fix');
  CREATE TABLE "lead_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"report" "enum_lead_files_report" NOT NULL,
  	"status" "enum_lead_files_status" DEFAULT 'review' NOT NULL,
  	"feedback" varchar,
  	"prefix" varchar DEFAULT 'lead-files',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "leads" ADD COLUMN "stage" "enum_leads_stage" DEFAULT 'intro';
  ALTER TABLE "leads" ADD COLUMN "guide" varchar DEFAULT 'Tyler';
  ALTER TABLE "leads" ADD COLUMN "stage_note" varchar;
  ALTER TABLE "leads" ADD COLUMN "portal_token" varchar;
  ALTER TABLE "leads" ADD COLUMN "test" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_files_id" integer;
  ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lead_files_lead_idx" ON "lead_files" USING btree ("lead_id");
  CREATE INDEX "lead_files_updated_at_idx" ON "lead_files" USING btree ("updated_at");
  CREATE INDEX "lead_files_created_at_idx" ON "lead_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_files_filename_idx" ON "lead_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "leads_portal_token_idx" ON "leads" USING btree ("portal_token");
  CREATE INDEX "payload_locked_documents_rels_lead_files_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lead_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lead_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_files_fk";
  
  DROP INDEX "leads_portal_token_idx";
  DROP INDEX "payload_locked_documents_rels_lead_files_id_idx";
  ALTER TABLE "leads" DROP COLUMN "stage";
  ALTER TABLE "leads" DROP COLUMN "guide";
  ALTER TABLE "leads" DROP COLUMN "stage_note";
  ALTER TABLE "leads" DROP COLUMN "portal_token";
  ALTER TABLE "leads" DROP COLUMN "test";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_files_id";
  DROP TYPE "public"."enum_leads_stage";
  DROP TYPE "public"."enum_lead_files_report";
  DROP TYPE "public"."enum_lead_files_status";`)
}
