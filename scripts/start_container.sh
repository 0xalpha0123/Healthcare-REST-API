docker-compose up -d dev -f ../docker-compose.yaml
npm run migration:generate
npm run seed:run