import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tuck_ins_chapter_pair" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"line" varchar,
  	"photo_id" integer,
  	"quote" varchar,
  	"source" varchar
  );
  
  CREATE TABLE "tuck_ins_chapter_kept" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"line" varchar,
  	"quote" varchar,
  	"source" varchar
  );
  
  CREATE TABLE "tuck_ins_chapter_films" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"line" varchar,
  	"quote" varchar,
  	"video_id" integer NOT NULL,
  	"poster_id" integer
  );
  
  ALTER TABLE "locations" ADD COLUMN "name" varchar;
  ALTER TABLE "tuck_ins" ADD COLUMN "chapter_headline" varchar;
  ALTER TABLE "tuck_ins" ADD COLUMN "chapter_intro" varchar;
  ALTER TABLE "tuck_ins_chapter_pair" ADD CONSTRAINT "tuck_ins_chapter_pair_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tuck_ins_chapter_pair" ADD CONSTRAINT "tuck_ins_chapter_pair_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tuck_ins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tuck_ins_chapter_kept" ADD CONSTRAINT "tuck_ins_chapter_kept_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tuck_ins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tuck_ins_chapter_films" ADD CONSTRAINT "tuck_ins_chapter_films_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tuck_ins_chapter_films" ADD CONSTRAINT "tuck_ins_chapter_films_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tuck_ins_chapter_films" ADD CONSTRAINT "tuck_ins_chapter_films_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tuck_ins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "tuck_ins_chapter_pair_order_idx" ON "tuck_ins_chapter_pair" USING btree ("_order");
  CREATE INDEX "tuck_ins_chapter_pair_parent_id_idx" ON "tuck_ins_chapter_pair" USING btree ("_parent_id");
  CREATE INDEX "tuck_ins_chapter_pair_photo_idx" ON "tuck_ins_chapter_pair" USING btree ("photo_id");
  CREATE INDEX "tuck_ins_chapter_kept_order_idx" ON "tuck_ins_chapter_kept" USING btree ("_order");
  CREATE INDEX "tuck_ins_chapter_kept_parent_id_idx" ON "tuck_ins_chapter_kept" USING btree ("_parent_id");
  CREATE INDEX "tuck_ins_chapter_films_order_idx" ON "tuck_ins_chapter_films" USING btree ("_order");
  CREATE INDEX "tuck_ins_chapter_films_parent_id_idx" ON "tuck_ins_chapter_films" USING btree ("_parent_id");
  CREATE INDEX "tuck_ins_chapter_films_video_idx" ON "tuck_ins_chapter_films" USING btree ("video_id");
  CREATE INDEX "tuck_ins_chapter_films_poster_idx" ON "tuck_ins_chapter_films" USING btree ("poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tuck_ins_chapter_pair" CASCADE;
  DROP TABLE "tuck_ins_chapter_kept" CASCADE;
  DROP TABLE "tuck_ins_chapter_films" CASCADE;
  ALTER TABLE "locations" DROP COLUMN "name";
  ALTER TABLE "tuck_ins" DROP COLUMN "chapter_headline";
  ALTER TABLE "tuck_ins" DROP COLUMN "chapter_intro";`)
}
