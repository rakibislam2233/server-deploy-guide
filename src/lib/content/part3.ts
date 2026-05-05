import type { GuideSection } from "@/types/guide";

export const guideSectionsPart3: GuideSection[] = [
  {
    id: "section-11",
    index: 11,
    scope: "both",
    tier: "recommended",
    titleBn: "CI/CD পাইপলাইন",
    titleEn: "CI/CD Pipeline",
    descriptionBn:
      "ম্যানুয়াল/ডকার ডেপ্লয় স্ক্রিপ্ট — সবার জন্য। GitHub Actions ও ব্লু-গ্রিন ঐচ্ছিক (ছোট রিলিজে ম্যানুয়াল স্ক্রিপ্টই চলে)।",
    descriptionEn:
      "Deploy scripts for everyone. GitHub Actions and blue-green are optional (many small releases use a manual script only).",
    whyBn: `ম্যানুয়াল ডেপ্লয় মানে একই কমান্ড সিরিজ বারবার — স্ক্রিপ্টে রাখলে ভুল কমে, অন্য কেউ রিলিজ করতে পারে। CI (GitHub Actions) দিয়ে মেইনে পুশ হলেই স্বয়ংক্রিয় SSH ডেপ্লয়।
উদাহরণ: /opt/scripts/deploy.sh এ git pull + build + pm2 reload একসাথে; ডকারে compose pull করে শুধু api সার্ভিস রিফ্রেশ করলে ডাউনটাইম কমে।`,
    whyEn: `Deployments are repetitive—scripts remove typos and let others release safely. CI runs the same steps after every merge to main.
Example: one deploy.sh does git pull + build + pm2 reload; Docker uses compose pull/up for a single service to reduce blast radius.`,
    subsections: [
      {
        id: "11-1",
        number: "11.1",
        titleBn: "ডেপ্লয় স্ক্রিপ্ট (ম্যানুয়াল)",
        titleEn: "Deploy script (manual)",
        purposeBn:
          "একই সিকোয়েন্স (পুল, বিল্ড, রিলোড) স্ক্রিপ্টে বন্ধ করলে ম্যানুয়াল টাইপো কমে, অন্য কেউ রিলিজ করতে পারে।",
        purposeEn:
          "Scripting pull/build/reload removes hand-typed mistakes and makes releases repeatable for the whole team.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            file: "/opt/scripts/deploy.sh",
            lang: "bash",
            code: `#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/var/www/backend"
git -C "$APP_DIR" fetch --all --prune
git -C "$APP_DIR" checkout main
git -C "$APP_DIR" pull --ff-only
cd "$APP_DIR" && npm ci && npm run build
pm2 reload ecosystem.config.js --only api`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo chmod +x /opt/scripts/deploy.sh`,
          },
        ],
      },
      {
        id: "11-2",
        number: "11.2",
        titleBn: "ডেপ্লয় স্ক্রিপ্ট (ডকার)",
        titleEn: "Deploy script (Docker)",
        purposeBn:
          "compose pull + এক সার্ভিস আপডেট দিয়ে ছোট ব্লাস্ট রেডিয়াস; পুরো স্ট্যাক না ঠেলে ডাউনটাইম কমে।",
        purposeEn:
          "Pulling and recreating one service limits blast radius versus restarting the entire compose stack.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: "/opt/scripts/deploy-docker.sh",
            lang: "bash",
            code: `#!/usr/bin/env bash
set -euo pipefail
cd /opt/compose
docker compose pull api
docker compose up -d --no-deps api`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo chmod +x /opt/scripts/deploy-docker.sh`,
          },
        ],
      },
      {
        id: "11-3",
        optional: true,
        number: "11.3",
        titleBn: "GitHub Actions",
        titleEn: "GitHub Actions workflow",
        purposeBn:
          "মেইনে মার্জ হলেই একই স্ক্রিপ্ট চালানো — ম্যানুয়াল ভুলে ভুল সার্ভারে SSH কম।",
        purposeEn:
          "CI triggers the same deploy script on every merge so releases are auditable and less error-prone.",
        nodes: [
          {
            type: "code",
            file: ".github/workflows/deploy.yml",
            lang: "yaml",
            code: `name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.PROD_HOST }}
          username: deploy
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            /opt/scripts/deploy.sh`,
          },
        ],
      },
      {
        id: "11-4",
        optional: true,
        number: "11.4",
        titleBn: "ব্লু-গ্রিন ডেপ্লয়",
        titleEn: "Blue-green deployment",
        purposeBn:
          "নতুন বিল্ড আলাদা ডিরে হেলথ চেক করে ট্রাফিক ফ্লিপ — বিগ ব্যাং রিলিজের ঝুঁকি কমে।",
        purposeEn:
          "Two directories let you build and verify a new release before flipping nginx to cut risky big-bang deploys.",
        nodes: [
          {
            type: "code",
            file: "/opt/scripts/blue-green.sh",
            lang: "bash",
            code: `#!/usr/bin/env bash
set -euo pipefail
ACTIVE=$(readlink -f /var/www/active)
if [[ "$ACTIVE" == "/var/www/blue" ]]; then
  TARGET="/var/www/green"
else
  TARGET="/var/www/blue"
fi
git clone --depth 1 git@github.com:org/backend.git "$TARGET"
# build, healthcheck, flip nginx upstream symlink
ln -sfn "$TARGET" /var/www/active
sudo nginx -s reload`,
          },
        ],
      },
    ],
  },
  {
    id: "section-12",
    index: 12,
    scope: "both",
    tier: "recommended",
    titleBn: "রোলব্যাক স্ট্র্যাটেজি",
    titleEn: "Rollback Strategy",
    descriptionBn: "ম্যানুয়াল গিট রিভার্ট ও ডকার ট্যাগ সোয়াপ।",
    descriptionEn: "Manual git revert and Docker tag swaps.",
    whyBn: `খারাপ রিলিজ হবেই — গুরুত্বপূর্ণ হলো কত দ্রুত পেছনে ফিরতে পারবেন। গিট কমিট পিন বা ডকার পুরনো ট্যাগে ফিরলে ব্যবহারকারী দ্রুত স্থিতি পায়।
উদাহরণ: নতুন বিল্ড ৫০২ দিলে rollback.sh LAST_GOOD_SHA দিয়ে আগের কমিটে ফিরে PM2 রিলোড; ডকারে আগের ইমেজ ট্যাগ এক্সপোর্ট করে compose up।`,
    whyEn: `Bad releases happen; what matters is time-to-recover. Pinning a known-good commit or Docker tag gets users stable again fast.
Example: if v1.2.0 breaks APIs, checkout v1.1.3 and reload PM2; with Docker, point APP_IMAGE to the previous digest/tag and recreate the container.`,
    subsections: [
      {
        id: "12-1",
        number: "12.1",
        titleBn: "রোলব্যাক (ম্যানুয়াল)",
        titleEn: "Rollback (manual)",
        purposeBn:
          "খারাপ কমিট দ্রুত ছেড়ে আগের SHA-তে ফিরে বিল্ড+রিলোড — MTTR কমায়।",
        purposeEn:
          "Fast path to a known-good commit, rebuild, and reload PM2 when a release misbehaves in production.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            file: "/opt/scripts/rollback.sh",
            lang: "bash",
            code: `#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/var/www/backend"
LAST_GOOD="\${1:-}"
if [[ -z "$LAST_GOOD" ]]; then
  echo "usage: rollback.sh <commit_sha>"
  exit 1
fi
git -C "$APP_DIR" checkout "$LAST_GOOD"
cd "$APP_DIR" && npm ci && npm run build
pm2 reload ecosystem.config.js --only api`,
          },
        ],
      },
      {
        id: "12-2",
        number: "12.2",
        titleBn: "রোলব্যাক (ডকার)",
        titleEn: "Rollback (Docker)",
        purposeBn:
          "ইমেজ ট্যাগ বা ডাইজেস্ট সোয়াপ করে কন্টেইনার পুনরায় তৈরি — গিট রিভার্ট ছাড়াই দ্রুত ফিরে যাওয়া।",
        purposeEn:
          "Point APP_IMAGE at the last good tag/digest and recreate the container for quick recovery without git surgery.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `export APP_IMAGE=ghcr.io/org/api:previous-good
docker compose up -d --no-deps api`,
          },
        ],
      },
    ],
  },
  {
    id: "section-13",
    index: 13,
    scope: "both",
    tier: "recommended",
    titleBn: "ব্যাকআপ স্ট্র্যাটেজি",
    titleEn: "Backup Strategy",
    descriptionBn: "MongoDB, PostgreSQL, ক্রন শিডিউল।",
    descriptionEn: "MongoDB, PostgreSQL, cron schedule.",
    whyBn: `রansomware, ভুল মাইগ্রেশন, বা ডিস্ক ফেল করলে ব্যাকআপ ছাড়া পুনরুদ্ধার অসম্ভব। অটোমেটেড ডাম্প + অফসাইট কপি মানে ঘুমোতে পারবেন।
উদাহরণ: প্রতিদিন রাত ২টায় mongodump আর্কাইভ, সপ্তাহে একবার S3-তে sync — রিটেনশন রাখুন যেন ডিস্ক না ভরে।`,
    whyEn: `Without backups, ransomware, bad migrations, or disk death means permanent data loss. Automated dumps + off-site copies are your insurance policy.
Example: nightly compressed DB dump to /backups plus weekly sync to object storage with retention to control disk usage.`,
    subsections: [
      {
        id: "13-1",
        number: "13.1",
        titleBn: "MongoDB ব্যাকআপ",
        titleEn: "MongoDB backup",
        purposeBn:
          "আর্কাইভড ডাম্প অফসাইটে না গেলে এক ডিস্ক ফেলে সব হারায়; ম্যানুয়াল ও ডকার উভয় রুট।",
        purposeEn:
          "Compressed mongodump archives are portable whether Mongo runs on-host or inside a container.",
        nodes: [
          {
            type: "code",
            file: "/opt/scripts/backup-mongo.sh (manual)",
            lang: "bash",
            code: `#!/usr/bin/env bash
mongodump --uri="$MONGO_URI" --archive=/backups/mongo-$(date +%F).gz --gzip`,
          },
          {
            type: "code",
            file: "docker exec one-liner",
            lang: "bash",
            code: `docker exec stack-mongo-1 mongodump --archive=/tmp/dump.gz --gzip
docker cp stack-mongo-1:/tmp/dump.gz ./mongo-$(date +%F).gz`,
          },
        ],
      },
      {
        id: "13-2",
        number: "13.2",
        titleBn: "PostgreSQL ব্যাকআপ",
        titleEn: "PostgreSQL backup",
        purposeBn:
          "pg_dump লজিক্যাল ব্যাকআপ — ভার্শন মিশম্যাচে ভলিউম কপির চেয়ে নিরাপদ অনেক সময়।",
        purposeEn:
          "Logical dumps via pg_dump are often safer across minor version skew than raw volume copies.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `pg_dump -h 127.0.0.1 -U appuser app | gzip > /backups/pg-$(date +%F).sql.gz`,
          },
          {
            type: "code",
            lang: "bash",
            code: `docker exec stack-postgres-1 pg_dump -U appuser app | gzip > pg-$(date +%F).sql.gz`,
          },
        ],
      },
      {
        id: "13-3",
        number: "13.3",
        titleBn: "ক্রন শিডিউল",
        titleEn: "Cron schedule",
        purposeBn:
          "ম্যানুয়াল রিমাইন্ডারে ব্যাকআপ ভুলে যায়; ক্রনে স্থির সময়ে চালালে অফসাইট সিঙ্কও একসাথে বাঁধা যায়।",
        purposeEn:
          "Cron turns backups into habit and can chain off-site sync after dumps complete.",
        nodes: [
          {
            type: "code",
            file: "crontab -e",
            lang: "bash",
            code: `0 2 * * * /opt/scripts/backup-mongo.sh
15 2 * * * /opt/scripts/backup-pg.sh
30 3 * * * /opt/scripts/offsite-sync.sh`,
          },
        ],
      },
    ],
  },
  {
    id: "section-14",
    index: 14,
    scope: "both",
    tier: "optional",
    titleBn: "ডিজাস্টার রিকভারি",
    titleEn: "Disaster Recovery",
    descriptionBn:
      "রিস্টোর কমান্ড — প্রয়োজনে। সম্পূর্ণ DR চেকলিস্ট বড়/মিশন-ক্রিটিকাল সিস্টেমের জন্য; ছোট অ্যাপে ঐচ্ছিক।",
    descriptionEn:
      "Restore commands when needed. Full DR checklist targets larger/mission-critical systems; optional for small apps.",
    whyBn: `DR মানে “পুরো অঞ্চল ডাউন” পরিস্থিতিতেও সিস্টেম ফেরানোর পরিকল্পনা। ছোট অ্যাপে অন্তত রিস্টোর কমান্ড জেনে রাখুন; বড় দলে ধাপে ধাপ চেকলিস্ট।
উদাহরণ: প্রোভাইডার ফায়ারে ডাটাসেন্টার হারালে নতুন ভিপিএসে ডাম্প রিস্টোর + DNS TTL কমিয়ে ট্রাফিক সরানো।`,
    whyEn: `DR is how you rebuild if the whole region or provider fails—not just a bad deploy. Small apps should at least practice restore; large teams use full runbooks.
Example: provider outage → provision new VPS → restore latest verified backup → lower DNS TTL ahead of time for faster cutover.`,
    subsections: [
      {
        id: "14-1",
        number: "14.1",
        titleBn: "MongoDB রিস্টোর",
        titleEn: "MongoDB restore",
        purposeBn:
          "ডাম্প থেকে পুনরুদ্ধার জানা থাকলে ইন্সিডেন্টে সময় বাঁচে; ডকার কপি পাথও একই।",
        purposeEn:
          "Practiced restore paths shrink incident time whether you stream from host or docker cp into the container.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `mongorestore --uri="$MONGO_URI" --archive=/backups/mongo-YYYY-MM-DD.gz --gzip`,
          },
          {
            type: "code",
            lang: "bash",
            code: `docker cp ./mongo-YYYY-MM-DD.gz stack-mongo-1:/tmp/dump.gz
docker exec stack-mongo-1 mongorestore --archive=/tmp/dump.gz --gzip`,
          },
        ],
      },
      {
        id: "14-2",
        optional: true,
        number: "14.2",
        titleBn: "ফুল রিকভারি চেকলিস্ট",
        titleEn: "Full recovery checklist",
        purposeBn:
          "পুরো অঞ্চল/প্রোভাইডার ফেলে গেলে ধাপ মিস করলে সেবা আধা-উঠা থেকে যায়; টেবিল হল রানবুক স্কেলেটন।",
        purposeEn:
          "Region-wide failures need ordered rebuild steps—this table is a runbook skeleton for both paths.",
        nodes: [
          {
            type: "table",
            stickyFirstColumn: true,
            headers: {
              bn: ["ধাপ", "ম্যানুয়াল", "ডকার"],
              en: ["Step", "Manual", "Docker"],
            },
            rows: [
              { bn: ["1", "নতুন ভিপিএস প্রভিজন", "নতুন ভিপিএস প্রভিজন"], en: ["1", "Provision new VPS", "Provision new VPS"] },
              { bn: ["2", "SSH কী ও ইউজার", "SSH কী ও ইউজার"], en: ["2", "SSH keys & user", "SSH keys & user"] },
              { bn: ["3", "UFW/Fail2ban", "UFW/Fail2ban"], en: ["3", "UFW/Fail2ban", "UFW/Fail2ban"] },
              { bn: ["4", "Nginx ইনস্টল", "ডকার ইনস্টল"], en: ["4", "Install Nginx", "Install Docker"] },
              { bn: ["5", "ডাটাবেজ ইনস্টল", "কম্পোজ স্ট্যাক"], en: ["5", "Install databases", "Compose stack"] },
              { bn: ["6", "রিস্টোর ডাম্প", "রিস্টোর ভলিউম/ডাম্প"], en: ["6", "Restore dumps", "Restore volumes/dumps"] },
              { bn: ["7", "গিট ক্লোন ও বিল্ড", "ইমেজ পুল"], en: ["7", "git clone & build", "docker compose pull"] },
              { bn: ["8", ".env পুনরুদ্ধার", ".env ও সিক্রেট"], en: ["8", "Restore .env", ".env & secrets"] },
              { bn: ["9", "PM2 স্টার্ট", "আপ স্ট্যাক"], en: ["9", "PM2 start", "docker compose up -d"] },
              { bn: ["10", "Nginx সাইট", "রিভার্স প্রক্সি"], en: ["10", "Nginx sites", "Reverse proxy"] },
              { bn: ["11", "SSL সার্ট", "SSL সার্ট/টানেল"], en: ["11", "SSL certs", "SSL certs/tunnel"] },
              { bn: ["12", "DNS আপডেট", "DNS আপডেট"], en: ["12", "DNS update", "DNS update"] },
              { bn: ["13", "স্মোক টেস্ট", "স্মোক টেস্ট"], en: ["13", "Smoke tests", "Smoke tests"] },
              { bn: ["14", "মনিটরিং পুনরায় সংযোগ", "মনিটরিং পুনরায় সংযোগ"], en: ["14", "Reconnect monitoring", "Reconnect monitoring"] },
              { bn: ["15", "ইন্সিডেন্ট নোট", "ইন্সিডেন্ট নোট"], en: ["15", "Incident notes", "Incident notes"] },
              { bn: ["16", "পোস্টমর্টেম", "—"], en: ["16", "Postmortem", "—"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "section-15",
    index: 15,
    scope: "both",
    tier: "recommended",
    titleBn: "সিকিউরিটি চেকলিস্ট",
    titleEn: "Security Checklist",
    descriptionBn: "সার্ভার, ডাটাবেজ, অ্যাপ, অপারেশন ও ট্রাবলশুটিং।",
    descriptionEn: "Server, DB, app, operations, troubleshooting.",
    whyBn: `চেকলিস্ট দিয়ে রিলিজের আগে/পরে “ভুলবো না তো?” দ্রুত যাচাই করেন — নিরাপত্তা শুধু টুল নয়, অভ্যাস। অপারেশন কমান্ড দিয়ে দৈনন্দিন স্বাস্থ্য দেখা।
উদাহরণ: নতুন সার্ভার হাতে পেলে UFW+SSH কী+ব্যাকআপ স্ক্রিপ্ট টিক দিন; ৫০২ হলে প্রথমে আপস্ট্রিম লগ, তারপর ডিস্ক।`,
    whyEn: `Checklists turn security into repeatable habits—not heroics. Ops commands help you notice drift (disk, queues) before users do.
Example: on any new box tick SSH keys, firewall, backups; on 502 check upstream health/logs first, then disk and TLS expiry.`,
    subsections: [
      {
        id: "15-1",
        number: "15.1",
        titleBn: "সার্ভার সিকিউরিটি",
        titleEn: "Server security",
        purposeBn:
          "সার্ফেস অ্যাটাক কমাতে SSH, ফায়ারওয়াল, প্যাচিং — অ্যাপ সিকিউর হলেও বক্স খোলা থাকলে লিক হয়।",
        purposeEn:
          "Harden the host first—weak SSH or firewalls leak data even if the application code is solid.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["আইটেম", "স্ট্যাটাস"],
              en: ["Item", "Status"],
            },
            rows: [
              { bn: ["রুট লগইন বন্ধ", "□"], en: ["Root login disabled", "□"] },
              { bn: ["কী-অনলি SSH", "□"], en: ["SSH key-only", "□"] },
              { bn: ["UFW সক্রিয়", "□"], en: ["UFW enabled", "□"] },
              { bn: ["অটো আপডেট", "□"], en: ["Unattended upgrades", "□"] },
            ],
          },
        ],
      },
      {
        id: "15-2",
        number: "15.2",
        titleBn: "ডাটাবেজ সিকিউরিটি",
        titleEn: "Database security",
        purposeBn:
          "পাবলিক বাইন্ড বা দুর্বল রোল মানে এক লিকে পুরো ডাটা; লোকাল বাইন্ড+রোল মিনিমাইজেশন।",
        purposeEn:
          "Keep DB ports private and roles tight so a single leaked credential cannot exfiltrate everything.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["আইটেম", "স্ট্যাটাস"],
              en: ["Item", "Status"],
            },
            rows: [
              { bn: ["শুধু লোকালহোস্ট বাইন্ড", "□"], en: ["Bind localhost only", "□"] },
              { bn: ["শক্তিশালী পাসওয়ার্ড/রোল", "□"], en: ["Strong passwords/roles", "□"] },
              { bn: ["নিয়মিত ব্যাকআপ", "□"], en: ["Regular backups", "□"] },
            ],
          },
        ],
      },
      {
        id: "15-3",
        number: "15.3",
        titleBn: "অ্যাপ্লিকেশন সিকিউরিটি",
        titleEn: "Application security",
        purposeBn:
          "হেডার ও রেট লিমিট ব্রাউজার/বট আক্রমণ কমায়; ডিপেন্ডেন্সি প্যাচ সাপ্লাই চেইন সুরক্ষা।",
        purposeEn:
          "Transport and app-layer controls (headers, rate limits, deps) close gaps firewalls cannot see.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["আইটেম", "স্ট্যাটাস"],
              en: ["Item", "Status"],
            },
            rows: [
              { bn: ["হেডার (HSTS, CSP)", "□"], en: ["Headers (HSTS, CSP)", "□"] },
              { bn: ["রেট লিমিট", "□"], en: ["Rate limiting", "□"] },
              { bn: ["ডিপেন্ডেন্সি আপডেট", "□"], en: ["Dependency updates", "□"] },
            ],
          },
        ],
      },
      {
        id: "15-4",
        number: "15.4",
        titleBn: "দৈনন্দিন কমান্ড",
        titleEn: "Daily operations commands",
        purposeBn:
          "দ্রুত স্বাস্থ্য চেক (প্রসেস, লগ, nginx) ইউজার রিপোর্টের আগে সমস্যা ধরে।",
        purposeEn:
          "Short command recipes for routine health checks before users report outages.",
        nodes: [
          {
            type: "code",
            file: "Manual",
            lang: "bash",
            code: `pm2 status
pm2 logs api --lines 200
sudo nginx -t && sudo systemctl reload nginx`,
          },
          {
            type: "code",
            file: "Docker",
            lang: "bash",
            code: `docker compose ps
docker compose logs -f --tail=200 api`,
          },
        ],
      },
      {
        id: "15-5",
        number: "15.5",
        titleBn: "ট্রাবলশুটিং",
        titleEn: "Troubleshooting",
        purposeBn:
          "লক্ষণ→পরীক্ষা ম্যাপ দিয়ে ডিবাগ অর্ডার ঠিক রাখা; ৫০২ এ আগে আপস্ট্রিম, পরে সার্ট/ডিস্ক।",
        purposeEn:
          "Symptom-to-check ordering avoids random log tailing—start upstream health, then TLS and disk.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["লক্ষণ", "পরীক্ষা"],
              en: ["Symptom", "Check"],
            },
            rows: [
              { bn: ["502", "আপস্ট্রিম/PM2/কন্টেইনার স্বাস্থ্য"], en: ["502", "Upstream/PM2/container health"] },
              { bn: ["SSL ত্রুটি", "সার্ট মেয়াদ ও চেইন"], en: ["SSL errors", "Cert expiry & chain"] },
              { bn: ["ডিস্ক পূর্ণ", "লগ ও ডাম্প পরিষ্কার"], en: ["Disk full", "Logs & dumps cleanup"] },
            ],
          },
        ],
      },
    ],
  },
];
