# Traceway on Railway

Deploy [Traceway](https://tracewayapp.com), an OpenTelemetry-native observability platform, on Railway with durable single-node storage.

The Deploy on Railway button is added only after the published route is rendered and verified.

## What this template deploys

- One Traceway service using `ghcr.io/tracewayapp/traceway:v1.9.11-sqlite`
- Immutable image index digest `sha256:b4ac5bd8eb63a31887a31a0fe79579fc750e74c29067dd73991c8e38d86413b3`
- A persistent Railway volume mounted at `/data` with daily backups
- Railway-managed HTTPS on port 8082 and a `/health` deployment check

The SQLite image is first-party, supports `linux/amd64` and `linux/arm64`, and needs no external database.

## First-time setup

Open the generated Railway domain and register the first account. That account becomes the owner of the only self-hosted organization. After the organization exists, Traceway rejects additional public registrations; invite teammates from inside Traceway instead.

`JWT_SECRET` is generated independently for each template deployment. Do not replace it after users are created because existing sessions depend on it.

## Send OpenTelemetry data

Create a project in Traceway and use its project token as a bearer token. OTLP/HTTP endpoints share the public Traceway origin:

```text
https://<your-domain>/api/otel/v1/traces
https://<your-domain>/api/otel/v1/metrics
https://<your-domain>/api/otel/v1/logs
```

Set the standard exporter headers to `Authorization=Bearer <project-token>`.

## Configuration

| Variable | Template value | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | Generated | Signs user sessions; keep stable. |
| `APP_BASE_URL` | Generated public HTTPS URL | Builds links in notifications and password-reset email. |
| `PORT` | `8082` | Selects the port used by Railway networking and health checks. |
| `PORTS` | `8082` | Binds Traceway to the same public and health-check port. |
| `SQLITE_RETENTION_DAYS` | `30` | Retains telemetry rows for 30 days; `0` disables pruning. |
| `SESSION_RECORDING_RETENTION_DAYS` | `30` | Retains local session recordings for 30 days; `0` disables pruning. |

SMTP, OAuth, OIDC, S3-compatible blob storage, paging, and notification integrations can be configured later with the [upstream server options](https://docs.tracewayapp.com/server).

## Persistence and backups

Both SQLite databases and local blobs live under `/data`. The template attaches one daily-backed-up Railway volume there. Deleting that volume permanently deletes users, projects, telemetry, source maps, and recordings.

Redeployments and deliberate image upgrades retain the volume. Back up before changing storage variants or running an upgrade.

## Important limitations

- This is Traceway's supported SQLite variant for a simple, modest-ingest, single-node deployment. High-volume installations should follow upstream's PostgreSQL and ClickHouse architecture instead.
- Keep the service at one replica. SQLite and the attached volume are not a horizontally shared datastore.
- The SQLite image does not include Chromium, so browser-based synthetic checks are unavailable. HTTP synthetic checks and the core logs, traces, metrics, replay, exceptions, and alerting paths remain available.
- Version `v1.9.11` is pinned because it is the newest release whose complete upstream container-release workflow succeeded during validation. Releases `v1.9.12` through `v1.9.14` did not produce a complete signed image set; do not switch to a moving tag such as `sqlite` or `latest`.

## Updating

1. Confirm a newer stable backend release has a successful container-release workflow.
2. Verify the exact versioned SQLite tag exists for both `linux/amd64` and `linux/arm64`, and record its digest.
3. Update the pinned template image deliberately; never use `latest` or the moving `sqlite` tag.
4. Repeat first-user, OTLP ingestion, negative-auth, persistence, redeploy, and delayed log-soak tests.

## Upstream

- Source: https://github.com/tracewayapp/traceway/tree/backend/v1.9.11
- Release: https://github.com/tracewayapp/traceway/releases/tag/backend/v1.9.11
- Documentation: https://docs.tracewayapp.com
- License: MIT

Traceway remains copyright its upstream contributors. This repository supplies Railway release documentation and is not affiliated with Railway or the Traceway project.
