import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_gallery_kind" AS ENUM('arrival', 'front-desk', 'treatment-room', 'consult', 'retail', 'detail');
  CREATE TABLE "brands_inside" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "locations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"kind" "enum_locations_gallery_kind" DEFAULT 'treatment-room' NOT NULL,
  	"caption" varchar
  );
  
  ALTER TABLE "brands_inside" ADD CONSTRAINT "brands_inside_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_inside" ADD CONSTRAINT "brands_inside_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_gallery" ADD CONSTRAINT "locations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "brands_inside_order_idx" ON "brands_inside" USING btree ("_order");
  CREATE INDEX "brands_inside_parent_id_idx" ON "brands_inside" USING btree ("_parent_id");
  CREATE INDEX "brands_inside_image_idx" ON "brands_inside" USING btree ("image_id");
  CREATE INDEX "locations_gallery_order_idx" ON "locations_gallery" USING btree ("_order");
  CREATE INDEX "locations_gallery_parent_id_idx" ON "locations_gallery" USING btree ("_parent_id");
  CREATE INDEX "locations_gallery_image_idx" ON "locations_gallery" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "brands_inside" CASCADE;
  DROP TABLE "locations_gallery" CASCADE;
  DROP TYPE "public"."enum_locations_gallery_kind";`)
}
