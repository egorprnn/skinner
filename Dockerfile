FROM imbios/bun-node:1.1.34-22.11.0-debian

WORKDIR /sknnr

ENV NODE_ENV=production
ENV SENTRY_AUTH_TOKEN=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
ENV SENTRY_DSN=https://8f324b63403fa1673d64c70f52541ce4@o280468.ingest.us.sentry.io/4507898459062272
ENV SENTRY_ORG=sknnr
ENV SENTRY_PROJECT=sknnr-backend

COPY . .

RUN bun install

WORKDIR /sknnr/packages/backend

RUN npm run build

CMD npm run start
