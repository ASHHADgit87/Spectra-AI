import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://6c8f1e11c55881159d562739d60b084a@o4510816280707072.ingest.de.sentry.io/4510816287260752",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});