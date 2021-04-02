## Running database

```bash
# development
$ docker-compose up dev

# development in background(detach)
$ docker-compose up -d dev

# production mode
$ docker-compose up prod

# after updating package.json
$ docker-compose build dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

```bash
# create migration
$ npm run migration:create -- <Migration_Name>

# run migrations
$ npm run migration:run

# revert migration
$ npm run migration:revert
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
