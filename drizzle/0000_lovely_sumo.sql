CREATE TABLE `start_dates` (
	`id` text PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`tour_id` text NOT NULL,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tour_id_idx` ON `start_dates` (`tour_id`);--> statement-breakpoint
CREATE TABLE `tours` (
	`id` text PRIMARY KEY NOT NULL,
	`create_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`duration` integer NOT NULL,
	`max_group_size` integer NOT NULL,
	`difficulty` text DEFAULT 'moderate',
	`price` integer NOT NULL,
	`discount_percent` integer DEFAULT 0,
	`ratings_avg` integer,
	`ratings_qty` integer,
	`summary` text,
	`description` text,
	`is_active` integer DEFAULT true,
	`is_featured` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tours_name_unique` ON `tours` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tours_slug_unique` ON `tours` (`slug`);