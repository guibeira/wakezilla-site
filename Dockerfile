FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY docs/package.json ./docs/package.json
RUN npm ci

COPY . .

CMD ["npm", "run", "build"]
