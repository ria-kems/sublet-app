CREATE TYPE "public"."listing_status_enum" AS ENUM('draft', 'active', 'rented', 'archived');--> statement-breakpoint
CREATE TYPE "public"."living_config_enum" AS ENUM('entire', 'private', 'shared');--> statement-breakpoint
CREATE TYPE "public"."property_type_enum" AS ENUM('apartment', 'studio', 'house', 'condo');--> statement-breakpoint
CREATE TYPE "public"."utility_coverage_enum" AS ENUM('included', 'partial', 'tenant_pays');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" bigint,
	"token_type" varchar(50),
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "amenities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "listing_amenities" (
	"listing_id" uuid NOT NULL,
	"amenity_id" uuid NOT NULL,
	CONSTRAINT "listing_amenities_listing_id_amenity_id_pk" PRIMARY KEY("listing_id","amenity_id")
);
--> statement-breakpoint
CREATE TABLE "listing_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"blob_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"property_type" "property_type_enum" DEFAULT 'apartment' NOT NULL,
	"living_config" "living_config_enum" DEFAULT 'entire' NOT NULL,
	"utilities" "utility_coverage_enum" DEFAULT 'tenant_pays' NOT NULL,
	"utilities_notes" text,
	"status" "listing_status_enum" DEFAULT 'active' NOT NULL,
	"price_cents" integer NOT NULL,
	"deposit_cents" integer DEFAULT 0 NOT NULL,
	"address_street" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"available_start" date NOT NULL,
	"available_end" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_amenities" ADD CONSTRAINT "listing_amenities_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_amenities" ADD CONSTRAINT "listing_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_listing_amenities_amenity_id" ON "listing_amenities" USING btree ("amenity_id");--> statement-breakpoint
CREATE INDEX "idx_listing_images_listing_id" ON "listing_images" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "idx_listings_city" ON "listings" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_listings_availability" ON "listings" USING btree ("available_start","available_end");--> statement-breakpoint
CREATE INDEX "idx_listings_price" ON "listings" USING btree ("price_cents");--> statement-breakpoint
CREATE INDEX "idx_listings_property_type" ON "listings" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "idx_listings_living_config" ON "listings" USING btree ("living_config");