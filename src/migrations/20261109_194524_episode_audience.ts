import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_episodes_audience" AS ENUM('owners', 'directors', 'providers', 'front-desk', 'marketers', 'patients');
  CREATE TABLE "episodes_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_episodes_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "episodes_audience" ADD CONSTRAINT "episodes_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "episodes_audience_order_idx" ON "episodes_audience" USING btree ("order");
  CREATE INDEX "episodes_audience_parent_idx" ON "episodes_audience" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "episodes_audience" CASCADE;
  DROP TYPE "public"."enum_episodes_audience";`)
}
