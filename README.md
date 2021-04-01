## Running the app using docker

```bash
# development
$ docker-compose up dev

# development in background(detach)
$ docker-compose up -d dev

# production mode
$ docker-compose up prod

# after updating package.json
$ docker-compose build
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
