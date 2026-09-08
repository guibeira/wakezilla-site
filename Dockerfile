FROM node:24-bookworm-slim

# Supply the font used when Sharp renders the social card from SVG.
RUN apt-get update && apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core

WORKDIR /app

COPY package.json package-lock.json ./
COPY docs/package.json ./docs/package.json
RUN npm ci

COPY . .

CMD ["npm", "run", "build"]
