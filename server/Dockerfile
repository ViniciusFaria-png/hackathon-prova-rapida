
FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]