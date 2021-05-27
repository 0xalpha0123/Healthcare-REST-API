FROM node:14.15.1-alpine as development
WORKDIR /usr/src/app
COPY . .
RUN npm install glob rimraf
RUN npm install
RUN npm run build

FROM node:14.15.1-alpine as production
WORKDIR /usr/src/app
COPY package*.json ./
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]