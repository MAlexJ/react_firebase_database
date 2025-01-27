import * as Sentry from "@sentry/react";

const sentryDsn = process.env.REACT_APP_TRACE_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn,
  integrations: [
    Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});