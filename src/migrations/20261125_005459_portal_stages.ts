/* Portal stages follow the board: old nda -> financials, visit -> valuation, loi -> diligence. */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "stage" SET DATA TYPE text;
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DEFAULT 'intro'::text;
  UPDATE "leads" SET "stage" = CASE "stage" WHEN 'nda' THEN 'financials' WHEN 'visit' THEN 'valuation' WHEN 'loi' THEN 'diligence' ELSE "stage" END;
  DROP TYPE "public"."enum_leads_stage";
  CREATE TYPE "public"."enum_leads_stage" AS ENUM('intro', 'nda', 'financials', 'proforma', 'valuation', 'offer', 'diligence', 'close');
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DEFAULT 'intro'::"public"."enum_leads_stage";
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DATA TYPE "public"."enum_leads_stage" USING "stage"::"public"."enum_leads_stage";
  ALTER TABLE "lead_files" ALTER COLUMN "report" SET DATA TYPE text;
  DROP TYPE "public"."enum_lead_files_report";
  CREATE TYPE "public"."enum_lead_files_report" AS ENUM('pl', 'svc', 'prov', 'payroll', 'dist', 'bs');
  ALTER TABLE "lead_files" ALTER COLUMN "report" SET DATA TYPE "public"."enum_lead_files_report" USING "report"::"public"."enum_lead_files_report";
  ALTER TABLE "leads" ADD COLUMN "fin_sent_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "stage" SET DATA TYPE text;
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DEFAULT 'intro'::text;
  UPDATE "leads" SET "stage" = CASE "stage" WHEN 'financials' THEN 'nda' WHEN 'proforma' THEN 'visit' WHEN 'valuation' THEN 'visit' WHEN 'offer' THEN 'visit' WHEN 'diligence' THEN 'loi' ELSE "stage" END;
  DROP TYPE "public"."enum_leads_stage";
  CREATE TYPE "public"."enum_leads_stage" AS ENUM('intro', 'nda', 'visit', 'loi', 'close');
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DEFAULT 'intro'::"public"."enum_leads_stage";
  ALTER TABLE "leads" ALTER COLUMN "stage" SET DATA TYPE "public"."enum_leads_stage" USING "stage"::"public"."enum_leads_stage";
  ALTER TABLE "lead_files" ALTER COLUMN "report" SET DATA TYPE text;
  DROP TYPE "public"."enum_lead_files_report";
  CREATE TYPE "public"."enum_lead_files_report" AS ENUM('pl', 'prov', 'svc', 'payroll', 'dist', 'bs');
  ALTER TABLE "lead_files" ALTER COLUMN "report" SET DATA TYPE "public"."enum_lead_files_report" USING "report"::"public"."enum_lead_files_report";
  ALTER TABLE "leads" DROP COLUMN "fin_sent_at";`)
}
