import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_kind" AS ENUM('partner', 'other');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TABLE "legal_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" jsonb NOT NULL
  );
  
  CREATE TABLE "legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated" timestamp(3) with time zone NOT NULL,
  	"order" numeric DEFAULT 1,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_leads_kind" NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"name" varchar,
  	"practice" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"topic" varchar,
  	"message" varchar,
  	"answers" jsonb,
  	"page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "team" ADD COLUMN "ask_about" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "legal_sections" ADD CONSTRAINT "legal_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "legal_sections_order_idx" ON "legal_sections" USING btree ("_order");
  CREATE INDEX "legal_sections_parent_id_idx" ON "legal_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "legal_slug_idx" ON "legal" USING btree ("slug");
  CREATE INDEX "legal_updated_at_idx" ON "legal" USING btree ("updated_at");
  CREATE INDEX "legal_created_at_idx" ON "legal" USING btree ("created_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_legal_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "legal_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "legal_sections" CASCADE;
  DROP TABLE "legal" CASCADE;
  DROP TABLE "leads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_legal_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  DROP INDEX "payload_locked_documents_rels_legal_id_idx";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  ALTER TABLE "team" DROP COLUMN "ask_about";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  DROP TYPE "public"."enum_leads_kind";
  DROP TYPE "public"."enum_leads_status";`)
}
