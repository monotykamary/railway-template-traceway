# Deploy and Host Traceway on Railway

## About Hosting Traceway

Traceway is an OpenTelemetry-native observability platform for logs, traces, metrics, session replay, exceptions, AI tracing, and on-call alerting. This template deploys the first-party `v1.9.19-sqlite` image as a durable, single-node Railway service.

Open the generated public domain and register the first account. That account becomes the owner of the self-hosted organization; later users should be invited from inside Traceway.

## Common Use Cases

- Collect OTLP/HTTP logs, traces, and metrics from applications
- Investigate exceptions, latency, and distributed traces
- Monitor AI requests, background jobs, and browser sessions
- Run a private observability service for a small team or project

## Dependencies for Traceway Hosting

### Deployment Dependencies

- One pinned Traceway service
- One persistent Railway volume mounted at `/data` with daily backups
- Railway-managed HTTPS on port 8082

No external PostgreSQL or ClickHouse service is required for this SQLite topology.

### Implementation Details

The template generates `JWT_SECRET`, derives `APP_BASE_URL` from the Traceway service's Railway public domain, and keeps both embedded databases and local blob storage under `/data`. It sets Railway `PORT` and Traceway `PORTS` to 8082 so the public domain and `/health` probe use the same listener; this avoids ambiguity because the upstream image exposes two HTTP ports. Traceway runs schema migrations and retention workers during startup.

Do not change generated cross-service expressions into validation values. Keep this SQLite service at one replica. It is intended for modest ingest; use upstream's PostgreSQL and ClickHouse architecture for high-volume production. The image does not include Chromium, so browser synthetic checks are unavailable, while HTTP checks and core observability features remain available.

Telemetry retention and local session-recording retention default to 30 days. Set the corresponding service variable to `0` only when you intentionally want unbounded retention.

## Why Deploy Traceway on Railway?

Railway provides managed HTTPS, generated secrets, a persistent volume with backups, health-gated deployments, and straightforward redeploys around Traceway's supported single-container SQLite image.
