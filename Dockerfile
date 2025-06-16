# Etapa 1: Build
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Runtime
FROM node:22-slim

WORKDIR /app

# Copia apenas os arquivos necessários
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/public ./dist/public

ENV NODE_ENV=production
ENV BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

EXPOSE 80

CMD ["npm", "run", "start"]
