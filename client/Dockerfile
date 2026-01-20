
FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev", "--host"]