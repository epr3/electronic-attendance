-- CreateTable
CREATE TABLE `user_mfas` (
    `id` VARCHAR(191) NOT NULL,
    `mfa_secret` VARCHAR(191) NOT NULL,
    `mfa_sms_only` BOOLEAN NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_mfas_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_mfas` ADD CONSTRAINT `user_mfas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
