import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brands_services" AS ENUM('Injectables', 'Lasers', 'Facials', 'Skincare', 'Wellness', 'Weight loss', 'Hormone therapy', 'Body', 'Surgery', 'Hair');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('Partnership', 'Network', 'Press', 'Team', 'Podcast');
  CREATE TYPE "public"."enum_resources_format" AS ENUM('Guide', 'Template', 'Calculator', 'Checklist', 'Video');
  CREATE TABLE "brands_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_brands_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "brands_stats_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"k" varchar,
  	"v" varchar
  );
  
  CREATE TABLE "brands_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short" varchar,
  	"ptr" numeric NOT NULL,
  	"since" timestamp(3) with time zone,
  	"established" numeric,
  	"website" varchar,
  	"intro" varchar,
  	"practice_eyebrow" varchar DEFAULT 'The practice',
  	"practice_headline" varchar,
  	"practice_body" jsonb,
  	"practice_image_id" integer,
  	"film_url" varchar,
  	"film_poster_id" integer,
  	"film_caption" varchar,
  	"why_headline" varchar,
  	"why_body" jsonb,
  	"why_image_id" integer,
  	"quote_text" varchar,
  	"quote_source" varchar,
  	"hero_video_id" integer,
  	"hero_poster_id" integer,
  	"logo_id" integer,
  	"tone" varchar,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"founders_id" integer
  );
  
  CREATE TABLE "locations_providers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"brand_id" integer NOT NULL,
  	"city" varchar NOT NULL,
  	"state" varchar NOT NULL,
  	"zip" varchar,
  	"address1" varchar,
  	"address2" varchar,
  	"lat" numeric NOT NULL,
  	"lng" numeric NOT NULL,
  	"map_bearing" numeric DEFAULT 0,
  	"phone" varchar,
  	"booking_url" varchar,
  	"photo_id" integer,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "founders_traits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"line" varchar
  );
  
  CREATE TABLE "founders_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"source" varchar NOT NULL
  );
  
  CREATE TABLE "founders_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"line" varchar
  );
  
  CREATE TABLE "founders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"credentials" varchar,
  	"headshot_id" integer,
  	"portrait_id" integer,
  	"headline" varchar,
  	"bio" jsonb,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "founders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"episodes_id" integer
  );
  
  CREATE TABLE "cta_images" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"location_id" integer,
  	"active" boolean DEFAULT true,
  	"soften" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "departments_timeline_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar
  );
  
  CREATE TABLE "departments_owns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "departments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"order" numeric NOT NULL,
  	"line" varchar,
  	"intro" jsonb,
  	"timeline_start" numeric NOT NULL,
  	"timeline_end" numeric NOT NULL,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_owns_for_you" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "team_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "team_background" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"org" varchar,
  	"role" varchar,
  	"years" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"department_id" integer NOT NULL,
  	"order" numeric DEFAULT 99,
  	"leader" boolean,
  	"headshot_id" integer,
  	"bio" jsonb,
  	"linkedin" varchar,
  	"quote_text" varchar,
  	"quote_source" varchar,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shows" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short" varchar,
  	"order" numeric,
  	"tagline" varchar,
  	"schedule" varchar,
  	"bg" varchar,
  	"fg" varchar,
  	"artwork_id" integer,
  	"rss" varchar,
  	"links_spotify" varchar,
  	"links_apple" varchar,
  	"links_youtube" varchar,
  	"featured" boolean,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shows_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"speakers_id" integer
  );
  
  CREATE TABLE "episodes_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "episodes_pull_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"at" varchar
  );
  
  CREATE TABLE "episodes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"show_id" integer NOT NULL,
  	"number" numeric,
  	"published" timestamp(3) with time zone,
  	"audio_url" varchar NOT NULL,
  	"duration" numeric,
  	"guid" varchar,
  	"summary" varchar,
  	"transcript" jsonb,
  	"video" varchar,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "episodes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"speakers_id" integer,
  	"tags_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "speakers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"headshot_id" integer,
  	"bio" varchar,
  	"team_member_id" integer,
  	"founder_id" integer,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_articles_category",
  	"published" timestamp(3) with time zone NOT NULL,
  	"dek" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"author_id" integer,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"format" "enum_resources_format",
  	"gated" boolean DEFAULT true,
  	"summary" varchar,
  	"cover_id" integer,
  	"file_id" integer,
  	"live" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"locations_id" integer,
  	"founders_id" integer,
  	"cta_images_id" integer,
  	"departments_id" integer,
  	"team_id" integer,
  	"shows_id" integer,
  	"episodes_id" integer,
  	"speakers_id" integer,
  	"tags_id" integer,
  	"articles_id" integer,
  	"resources_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "network" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brands_override" numeric,
  	"locations_override" numeric,
  	"states_override" numeric,
  	"address" varchar DEFAULT '993 Governor Dr #101, El Dorado Hills, CA 95762',
  	"instagram" varchar,
  	"linkedin" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "brands_services" ADD CONSTRAINT "brands_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_stats_rows" ADD CONSTRAINT "brands_stats_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_stats" ADD CONSTRAINT "brands_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_practice_image_id_media_id_fk" FOREIGN KEY ("practice_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_film_poster_id_media_id_fk" FOREIGN KEY ("film_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_why_image_id_media_id_fk" FOREIGN KEY ("why_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_founders_fk" FOREIGN KEY ("founders_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_providers" ADD CONSTRAINT "locations_providers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_providers" ADD CONSTRAINT "locations_providers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "founders_traits" ADD CONSTRAINT "founders_traits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "founders_quotes" ADD CONSTRAINT "founders_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "founders_milestones" ADD CONSTRAINT "founders_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "founders" ADD CONSTRAINT "founders_headshot_id_media_id_fk" FOREIGN KEY ("headshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "founders" ADD CONSTRAINT "founders_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "founders" ADD CONSTRAINT "founders_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "founders_rels" ADD CONSTRAINT "founders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "founders_rels" ADD CONSTRAINT "founders_rels_episodes_fk" FOREIGN KEY ("episodes_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cta_images" ADD CONSTRAINT "cta_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cta_images" ADD CONSTRAINT "cta_images_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments_timeline_phases" ADD CONSTRAINT "departments_timeline_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments_owns" ADD CONSTRAINT "departments_owns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_owns_for_you" ADD CONSTRAINT "team_owns_for_you_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_metrics" ADD CONSTRAINT "team_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_background" ADD CONSTRAINT "team_background_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_headshot_id_media_id_fk" FOREIGN KEY ("headshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shows" ADD CONSTRAINT "shows_artwork_id_media_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shows" ADD CONSTRAINT "shows_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shows_rels" ADD CONSTRAINT "shows_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "shows_rels" ADD CONSTRAINT "shows_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes_chapters" ADD CONSTRAINT "episodes_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes_pull_quotes" ADD CONSTRAINT "episodes_pull_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes" ADD CONSTRAINT "episodes_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "episodes" ADD CONSTRAINT "episodes_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "episodes_rels" ADD CONSTRAINT "episodes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes_rels" ADD CONSTRAINT "episodes_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes_rels" ADD CONSTRAINT "episodes_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "episodes_rels" ADD CONSTRAINT "episodes_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_headshot_id_media_id_fk" FOREIGN KEY ("headshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_team_member_id_team_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_founder_id_founders_id_fk" FOREIGN KEY ("founder_id") REFERENCES "public"."founders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_team_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_founders_fk" FOREIGN KEY ("founders_id") REFERENCES "public"."founders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cta_images_fk" FOREIGN KEY ("cta_images_id") REFERENCES "public"."cta_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shows_fk" FOREIGN KEY ("shows_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_episodes_fk" FOREIGN KEY ("episodes_id") REFERENCES "public"."episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "brands_services_order_idx" ON "brands_services" USING btree ("order");
  CREATE INDEX "brands_services_parent_idx" ON "brands_services" USING btree ("parent_id");
  CREATE INDEX "brands_stats_rows_order_idx" ON "brands_stats_rows" USING btree ("_order");
  CREATE INDEX "brands_stats_rows_parent_id_idx" ON "brands_stats_rows" USING btree ("_parent_id");
  CREATE INDEX "brands_stats_order_idx" ON "brands_stats" USING btree ("_order");
  CREATE INDEX "brands_stats_parent_id_idx" ON "brands_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_ptr_idx" ON "brands" USING btree ("ptr");
  CREATE INDEX "brands_practice_practice_image_idx" ON "brands" USING btree ("practice_image_id");
  CREATE INDEX "brands_film_film_poster_idx" ON "brands" USING btree ("film_poster_id");
  CREATE INDEX "brands_why_why_image_idx" ON "brands" USING btree ("why_image_id");
  CREATE INDEX "brands_hero_video_idx" ON "brands" USING btree ("hero_video_id");
  CREATE INDEX "brands_hero_poster_idx" ON "brands" USING btree ("hero_poster_id");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_seo_seo_image_idx" ON "brands" USING btree ("seo_image_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "brands_rels_order_idx" ON "brands_rels" USING btree ("order");
  CREATE INDEX "brands_rels_parent_idx" ON "brands_rels" USING btree ("parent_id");
  CREATE INDEX "brands_rels_path_idx" ON "brands_rels" USING btree ("path");
  CREATE INDEX "brands_rels_founders_id_idx" ON "brands_rels" USING btree ("founders_id");
  CREATE INDEX "locations_providers_order_idx" ON "locations_providers" USING btree ("_order");
  CREATE INDEX "locations_providers_parent_id_idx" ON "locations_providers" USING btree ("_parent_id");
  CREATE INDEX "locations_providers_photo_idx" ON "locations_providers" USING btree ("photo_id");
  CREATE INDEX "locations_brand_idx" ON "locations" USING btree ("brand_id");
  CREATE INDEX "locations_photo_idx" ON "locations" USING btree ("photo_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_seo_seo_image_idx" ON "locations" USING btree ("seo_image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "founders_traits_order_idx" ON "founders_traits" USING btree ("_order");
  CREATE INDEX "founders_traits_parent_id_idx" ON "founders_traits" USING btree ("_parent_id");
  CREATE INDEX "founders_quotes_order_idx" ON "founders_quotes" USING btree ("_order");
  CREATE INDEX "founders_quotes_parent_id_idx" ON "founders_quotes" USING btree ("_parent_id");
  CREATE INDEX "founders_milestones_order_idx" ON "founders_milestones" USING btree ("_order");
  CREATE INDEX "founders_milestones_parent_id_idx" ON "founders_milestones" USING btree ("_parent_id");
  CREATE INDEX "founders_headshot_idx" ON "founders" USING btree ("headshot_id");
  CREATE INDEX "founders_portrait_idx" ON "founders" USING btree ("portrait_id");
  CREATE UNIQUE INDEX "founders_slug_idx" ON "founders" USING btree ("slug");
  CREATE INDEX "founders_seo_seo_image_idx" ON "founders" USING btree ("seo_image_id");
  CREATE INDEX "founders_updated_at_idx" ON "founders" USING btree ("updated_at");
  CREATE INDEX "founders_created_at_idx" ON "founders" USING btree ("created_at");
  CREATE INDEX "founders_rels_order_idx" ON "founders_rels" USING btree ("order");
  CREATE INDEX "founders_rels_parent_idx" ON "founders_rels" USING btree ("parent_id");
  CREATE INDEX "founders_rels_path_idx" ON "founders_rels" USING btree ("path");
  CREATE INDEX "founders_rels_episodes_id_idx" ON "founders_rels" USING btree ("episodes_id");
  CREATE INDEX "cta_images_image_idx" ON "cta_images" USING btree ("image_id");
  CREATE INDEX "cta_images_location_idx" ON "cta_images" USING btree ("location_id");
  CREATE INDEX "cta_images_updated_at_idx" ON "cta_images" USING btree ("updated_at");
  CREATE INDEX "cta_images_created_at_idx" ON "cta_images" USING btree ("created_at");
  CREATE INDEX "departments_timeline_phases_order_idx" ON "departments_timeline_phases" USING btree ("_order");
  CREATE INDEX "departments_timeline_phases_parent_id_idx" ON "departments_timeline_phases" USING btree ("_parent_id");
  CREATE INDEX "departments_owns_order_idx" ON "departments_owns" USING btree ("_order");
  CREATE INDEX "departments_owns_parent_id_idx" ON "departments_owns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "departments_slug_idx" ON "departments" USING btree ("slug");
  CREATE INDEX "departments_seo_seo_image_idx" ON "departments" USING btree ("seo_image_id");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE INDEX "team_owns_for_you_order_idx" ON "team_owns_for_you" USING btree ("_order");
  CREATE INDEX "team_owns_for_you_parent_id_idx" ON "team_owns_for_you" USING btree ("_parent_id");
  CREATE INDEX "team_metrics_order_idx" ON "team_metrics" USING btree ("_order");
  CREATE INDEX "team_metrics_parent_id_idx" ON "team_metrics" USING btree ("_parent_id");
  CREATE INDEX "team_background_order_idx" ON "team_background" USING btree ("_order");
  CREATE INDEX "team_background_parent_id_idx" ON "team_background" USING btree ("_parent_id");
  CREATE INDEX "team_department_idx" ON "team" USING btree ("department_id");
  CREATE INDEX "team_headshot_idx" ON "team" USING btree ("headshot_id");
  CREATE UNIQUE INDEX "team_slug_idx" ON "team" USING btree ("slug");
  CREATE INDEX "team_seo_seo_image_idx" ON "team" USING btree ("seo_image_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "shows_artwork_idx" ON "shows" USING btree ("artwork_id");
  CREATE UNIQUE INDEX "shows_slug_idx" ON "shows" USING btree ("slug");
  CREATE INDEX "shows_seo_seo_image_idx" ON "shows" USING btree ("seo_image_id");
  CREATE INDEX "shows_updated_at_idx" ON "shows" USING btree ("updated_at");
  CREATE INDEX "shows_created_at_idx" ON "shows" USING btree ("created_at");
  CREATE INDEX "shows_rels_order_idx" ON "shows_rels" USING btree ("order");
  CREATE INDEX "shows_rels_parent_idx" ON "shows_rels" USING btree ("parent_id");
  CREATE INDEX "shows_rels_path_idx" ON "shows_rels" USING btree ("path");
  CREATE INDEX "shows_rels_speakers_id_idx" ON "shows_rels" USING btree ("speakers_id");
  CREATE INDEX "episodes_chapters_order_idx" ON "episodes_chapters" USING btree ("_order");
  CREATE INDEX "episodes_chapters_parent_id_idx" ON "episodes_chapters" USING btree ("_parent_id");
  CREATE INDEX "episodes_pull_quotes_order_idx" ON "episodes_pull_quotes" USING btree ("_order");
  CREATE INDEX "episodes_pull_quotes_parent_id_idx" ON "episodes_pull_quotes" USING btree ("_parent_id");
  CREATE INDEX "episodes_show_idx" ON "episodes" USING btree ("show_id");
  CREATE INDEX "episodes_published_idx" ON "episodes" USING btree ("published");
  CREATE UNIQUE INDEX "episodes_guid_idx" ON "episodes" USING btree ("guid");
  CREATE UNIQUE INDEX "episodes_slug_idx" ON "episodes" USING btree ("slug");
  CREATE INDEX "episodes_seo_seo_image_idx" ON "episodes" USING btree ("seo_image_id");
  CREATE INDEX "episodes_updated_at_idx" ON "episodes" USING btree ("updated_at");
  CREATE INDEX "episodes_created_at_idx" ON "episodes" USING btree ("created_at");
  CREATE INDEX "episodes_rels_order_idx" ON "episodes_rels" USING btree ("order");
  CREATE INDEX "episodes_rels_parent_idx" ON "episodes_rels" USING btree ("parent_id");
  CREATE INDEX "episodes_rels_path_idx" ON "episodes_rels" USING btree ("path");
  CREATE INDEX "episodes_rels_speakers_id_idx" ON "episodes_rels" USING btree ("speakers_id");
  CREATE INDEX "episodes_rels_tags_id_idx" ON "episodes_rels" USING btree ("tags_id");
  CREATE INDEX "episodes_rels_brands_id_idx" ON "episodes_rels" USING btree ("brands_id");
  CREATE INDEX "speakers_headshot_idx" ON "speakers" USING btree ("headshot_id");
  CREATE INDEX "speakers_team_member_idx" ON "speakers" USING btree ("team_member_id");
  CREATE INDEX "speakers_founder_idx" ON "speakers" USING btree ("founder_id");
  CREATE UNIQUE INDEX "speakers_slug_idx" ON "speakers" USING btree ("slug");
  CREATE INDEX "speakers_updated_at_idx" ON "speakers" USING btree ("updated_at");
  CREATE INDEX "speakers_created_at_idx" ON "speakers" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_seo_seo_image_idx" ON "articles" USING btree ("seo_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_brands_id_idx" ON "articles_rels" USING btree ("brands_id");
  CREATE INDEX "resources_cover_idx" ON "resources" USING btree ("cover_id");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_seo_seo_image_idx" ON "resources" USING btree ("seo_image_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_founders_id_idx" ON "payload_locked_documents_rels" USING btree ("founders_id");
  CREATE INDEX "payload_locked_documents_rels_cta_images_id_idx" ON "payload_locked_documents_rels" USING btree ("cta_images_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_shows_id_idx" ON "payload_locked_documents_rels" USING btree ("shows_id");
  CREATE INDEX "payload_locked_documents_rels_episodes_id_idx" ON "payload_locked_documents_rels" USING btree ("episodes_id");
  CREATE INDEX "payload_locked_documents_rels_speakers_id_idx" ON "payload_locked_documents_rels" USING btree ("speakers_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "brands_services" CASCADE;
  DROP TABLE "brands_stats_rows" CASCADE;
  DROP TABLE "brands_stats" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "brands_rels" CASCADE;
  DROP TABLE "locations_providers" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "founders_traits" CASCADE;
  DROP TABLE "founders_quotes" CASCADE;
  DROP TABLE "founders_milestones" CASCADE;
  DROP TABLE "founders" CASCADE;
  DROP TABLE "founders_rels" CASCADE;
  DROP TABLE "cta_images" CASCADE;
  DROP TABLE "departments_timeline_phases" CASCADE;
  DROP TABLE "departments_owns" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "team_owns_for_you" CASCADE;
  DROP TABLE "team_metrics" CASCADE;
  DROP TABLE "team_background" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "shows" CASCADE;
  DROP TABLE "shows_rels" CASCADE;
  DROP TABLE "episodes_chapters" CASCADE;
  DROP TABLE "episodes_pull_quotes" CASCADE;
  DROP TABLE "episodes" CASCADE;
  DROP TABLE "episodes_rels" CASCADE;
  DROP TABLE "speakers" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "network" CASCADE;
  DROP TYPE "public"."enum_brands_services";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_resources_format";`)
}
