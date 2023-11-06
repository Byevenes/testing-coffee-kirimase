CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"description" text,
	"unit_price" real DEFAULT 0 NOT NULL,
	"unit_in_stock" integer DEFAULT 0 NOT NULL,
	"unit_on_order" integer DEFAULT 0 NOT NULL,
	"discontinued" integer DEFAULT 0,
	"images" json DEFAULT 'null'::json,
	"points" integer DEFAULT 0
);
