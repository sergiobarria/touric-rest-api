DROP INDEX "tour_id_idx";--> statement-breakpoint
DROP INDEX "tours_name_unique";--> statement-breakpoint
DROP INDEX "tours_slug_unique";--> statement-breakpoint
ALTER TABLE `tours` ALTER COLUMN "difficulty" TO "difficulty" text NOT NULL DEFAULT 'moderate';--> statement-breakpoint
CREATE INDEX `tour_id_idx` ON `start_dates` (`tour_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tours_name_unique` ON `tours` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tours_slug_unique` ON `tours` (`slug`);--> statement-breakpoint
ALTER TABLE `tours` ADD `is_deleted` integer DEFAULT false;