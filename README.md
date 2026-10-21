# KirBot Panel

## PHP 8.5 container compatibility

This keeps Laravel 8, the existing frontend packages and `yarn.lock`, and the
production bind mount at `/var/www`. Laravel is updated within version 8 to
8.83.29 so newer PHP deprecations no longer abort startup. Composer dependencies
are locked for PHP 8.5; the PHP 7-only Faker development package is replaced by
its compatible successor. No application features or database schema are changed.

### Existing production deployment

Build the updated runtime from the companion `docker-laravel` repository on the
deployment host, using a new tag so the old image remains available:

```sh
docker build --pull -t mrkirby153/laravel:php85 /path/to/docker-laravel
```

This tag must be built locally or published to your registry before deployment;
it is not an existing published release. Keep the existing Compose services:

```yaml
web:
  image: mrkirby153/laravel:php85
  restart: always
  ports:
    - "127.0.0.1:8580:80"
  volumes:
    - ./KirBotPanel:/var/www
  depends_on:
    - redis
    - db
```

Alternatively, merge `compose.php85.yaml` with the existing Compose file; it only
changes the web image and production environment. From the deployment directory
containing `docker-compose.yml` and `KirBotPanel`, after checking out this branch:

```sh
docker compose -f docker-compose.yml -f KirBotPanel/compose.php85.yaml stop web
docker compose -f docker-compose.yml -f KirBotPanel/compose.php85.yaml run --rm --no-deps web bash -euc '
  composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
  corepack yarn@1.22.22 install --frozen-lockfile --non-interactive
  NODE_OPTIONS=--openssl-legacy-provider corepack yarn@1.22.22 production
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
  chown -R nginx:nginx storage bootstrap/cache
'
docker compose -f docker-compose.yml -f KirBotPanel/compose.php85.yaml up -d --no-deps web
```

Use your actual base Compose filename if different. The override preserves the
loopback-only port, mount, restart policy, and dependency services. The application
continues to read the mounted `.env`; keep its existing `APP_KEY`, database, Redis,
Discord and bot settings. Database/Redis hosts should be their Compose service
names (`db` and `redis`), as in the existing deployment. No migrations or key
regeneration are needed for this compatibility change.

Yarn Classic and the OpenSSL option are used only for the existing Webpack 4
asset build. They avoid a frontend dependency migration. For local tests inside
the new runtime, install development dependencies with `composer install` and run
`vendor/bin/phpunit`, using a test environment and a valid `APP_KEY`.

### Validation and limits

Validated on PHP 8.5.11: production dependency installation, PHP platform
requirements, production asset compilation, and HTTP tests for the home/login
pages, guest redirect, GD icon generation, and expired archives. Authenticated
Discord/bot flows and the production database require a deployment-environment
check. Existing API routes referencing absent chat/music controllers are unchanged.

Laravel 8 and several legacy dependencies remain unsupported and have known
security advisories. This is a compatibility update, not a security modernization;
keep `APP_DEBUG=false` in production. PHP 8.5 may still emit legacy deprecation
notices. No Composer security policy is disabled in this repository; resolving
stable Laravel 8 packages during this change required a one-time
`--no-security-blocking` update. Deployment uses the committed lockfile.
