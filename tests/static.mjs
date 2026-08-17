import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const readme = readFileSync("README.md", "utf8");
const marketplace = readFileSync("TEMPLATE_README.md", "utf8");
const notices = readFileSync("THIRD_PARTY_NOTICES.md", "utf8");
const icon = readFileSync("assets/traceway-icon.png");
const allText = `${readme}\n${marketplace}\n${notices}`;

assert.match(readme, /ghcr\.io\/tracewayapp\/traceway:v1\.9\.11-sqlite/);
assert.match(readme, /sha256:b4ac5bd8eb63a31887a31a0fe79579fc750e74c29067dd73991c8e38d86413b3/);
assert.doesNotMatch(allText, /traceway:(?:latest|sqlite)(?:\s|`|@|$)/);
assert.match(readme, /Keep the service at one replica/i);
assert.match(readme, /browser-based synthetic checks are unavailable/i);
assert.match(readme, /register the first account/i);
assert.ok(readme.includes("| `PORT` | `8082` |"));
assert.ok(readme.includes("| `PORTS` | `8082` |"));
assert.match(marketplace, /HTTPS on port 8082/);

for (const section of [
  "# Deploy and Host Traceway on Railway",
  "## About Hosting Traceway",
  "## Common Use Cases",
  "## Dependencies for Traceway Hosting",
  "### Deployment Dependencies",
  "### Implementation Details",
  "## Why Deploy Traceway on Railway?",
]) {
  assert.ok(marketplace.includes(section), `missing marketplace section: ${section}`);
}

assert.equal(icon.readUInt32BE(16), 512);
assert.equal(icon.readUInt32BE(20), 512);
assert.equal(
  createHash("sha256").update(icon).digest("hex"),
  "e7fed5fb6a53da3245ede2ec2e814abc9f9efbaab140fb4558821dea20bc162b",
);
assert.match(notices, /59f3d528dbda9fdb46f9cb309669f4922b44324b/);

const deployLinks = [...readme.matchAll(/https:\/\/railway\.com\/deploy\/([^)?\s]+)\?referralCode=ZqgrJ0/g)];
assert.ok(deployLinks.length <= 1, "README must contain at most one deploy button");
if (deployLinks.length === 1) {
  assert.doesNotMatch(deployLinks[0][1], /[<>]/);
}

console.log("static template checks passed");
