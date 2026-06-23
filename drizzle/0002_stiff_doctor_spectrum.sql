CREATE TABLE `thumbnailFeedback` (
	`id` varchar(64) NOT NULL,
	`assetId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`helpful` boolean,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thumbnailFeedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `thumbnailFeedback` ADD CONSTRAINT `thumbnailFeedback_assetId_assets_id_fk` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `thumbnailFeedback` ADD CONSTRAINT `thumbnailFeedback_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;