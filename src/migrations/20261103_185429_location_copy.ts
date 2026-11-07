import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "locations_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "locations_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar NOT NULL,
  	"line" varchar NOT NULL
  );
  
  ALTER TABLE "locations" ADD COLUMN "story" jsonb;
  ALTER TABLE "locations" ADD COLUMN "arrival_note" varchar;
  ALTER TABLE "locations" ADD COLUMN "quote_text" varchar;
  ALTER TABLE "locations" ADD COLUMN "quote_source" varchar;
  ALTER TABLE "locations_hours" ADD CONSTRAINT "locations_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_milestones" ADD CONSTRAINT "locations_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "locations_hours_order_idx" ON "locations_hours" USING btree ("_order");
  CREATE INDEX "locations_hours_parent_id_idx" ON "locations_hours" USING btree ("_parent_id");
  CREATE INDEX "locations_milestones_order_idx" ON "locations_milestones" USING btree ("_order");
  CREATE INDEX "locations_milestones_parent_id_idx" ON "locations_milestones" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "locations_hours" CASCADE;
  DROP TABLE "locations_milestones" CASCADE;
  ALTER TABLE "locations" DROP COLUMN "story";
  ALTER TABLE "locations" DROP COLUMN "arrival_note";
  ALTER TABLE "locations" DROP COLUMN "quote_text";
  ALTER TABLE "locations" DROP COLUMN "quote_source";`)
}
