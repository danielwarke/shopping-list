FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY --chown=node:node . .

RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS production

ENV NODE_ENV production

WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/main.js"]
