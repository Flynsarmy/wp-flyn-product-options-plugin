<?php

namespace Flyn\ProductOptions;

use WP_CLI;

class CLI {
	/**
	 * Migrate TM Extra Product Options global forms to Product Addons (prad_option posts).
	 *
	 * ## OPTIONS
	 *
	 * [--dry-run]
	 * : Print what would be migrated without writing anything to the database.
	 *
	 * [--delete-existing]
	 * : Delete all existing prad_option posts and product assignment meta before
	 *   running the migration. Use with caution.
	 *
	 * ## EXAMPLES
	 *
	 *     ddev wp flynpo migrateTwo
	 *     ddev wp flynpo migrateTwo --dry-run
	 *     ddev wp flynpo migrateTwo --delete-existing
	 *
	 * @when after_wp_load
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function migrateTwo( $args = null, $assoc_args = null ): void {
		$dry_run         = isset( $assoc_args['dry-run'] );
		$delete_existing = isset( $assoc_args['delete-existing'] );

		if ( $dry_run ) {
			WP_CLI::log( WP_CLI::colorize( '%YDRY RUN MODE - no database changes will be made.%n' ) );
		}

		if ( $delete_existing && ! $dry_run ) {
			WP_CLI::confirm(
				'This will delete ALL existing prad_option posts and product assignment meta. Are you sure?',
				$assoc_args
			);
		}

		$migrator = new MigrateTwo();

		$logger = static function ( string $message, string $type = 'log' ) {
			switch ( $type ) {
				case 'error':
					WP_CLI::warning( $message );
					break;
				case 'warning':
					WP_CLI::log( WP_CLI::colorize( '%y' . $message . '%n' ) );
					break;
				default:
					WP_CLI::log( $message );
					break;
			}
		};

		WP_CLI::log( 'Starting TM EPO -> Product Addons migration...' );
		WP_CLI::log( '' );

		$result = $migrator->run( $dry_run, $delete_existing, $logger );

		WP_CLI::log( '' );

		if ( $dry_run ) {
			WP_CLI::success(
				sprintf(
					'Dry run complete. Would migrate %d forms with %d warning(s).',
					$result['migrated'],
					count( $result['warnings'] )
				)
			);
		} else {
			WP_CLI::success(
				sprintf(
					'Migration complete: %d migrated, %d skipped, %d warning(s).',
					$result['migrated'],
					$result['skipped'],
					count( $result['warnings'] )
				)
			);
		}
	}
}
