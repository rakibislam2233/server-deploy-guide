import type { GuideSection } from "@/types/guide";

export const guideSectionsPart1: GuideSection[] = [
  {
    id: "section-1",
    index: 1,
    scope: "both",
    tier: "recommended",
    titleBn: "প্রাথমিক সার্ভার সেটআপ ও সিকিউরিটি",
    titleEn: "Initial Server Setup & Security",
    descriptionBn:
      "সোয়াপ, আপডেট, ডিপ্লয় ইউজার, SSH কী, ফায়ারওয়াল ও Fail2ban — সব আকারের অ্যাপের জন্য। ২FA ও CrowdSec ছোট/মাঝারি সেটআপে ঐচ্ছিক।",
    descriptionEn:
      "Swap, updates, deploy user, SSH keys, firewall, and Fail2ban suit any app size. SSH 2FA and CrowdSec are optional for smaller setups.",
    whyBn: `ধরুন আপনি একটি ছোট ভিপিএসে প্রথমবার সার্ভার চালু করছেন। ইন্টারনেটে প্রতিটি সার্ভিস (SSH সহ) বট ও ব্রুটফোর্সের সামনে খোলা থাকে। তাই আগে সোয়াপ ও আপডেট দিয়ে স্টেবিল বেস, তারপর নন-রুট ডিপ্লয় ইউজার ও কী-বেস SSH দিয়ে লগইন সুরক্ষিত করাই স্ট্যান্ডার্ড।
উদাহরণ: রুটে Node চালালে একটা RCE বাগ পুরো সার্ভার কম্প্রোমাইজ করতে পারে; ডিপ্লয় ইউজার + UFW দিয়ে ব্লাস্ট রেডিয়াস ছোট হয়।`,
    whyEn: `Imagine a fresh VPS on the public internet: every open port (including SSH) is scanned within hours. Swap + updates stabilize the OS; a deploy user + SSH keys + firewall shrink your blast radius versus logging in as root with a password.
Example: running Node as root means one app bug can own the whole box; a dedicated user + UFW limits what attackers can reach.`,
    subsections: [
      {
        id: "1-1",
        number: "1.1",
        titleBn: "সোয়াপ মেমোরি",
        titleEn: "Swap memory",
        purposeBn:
          "RAM কম থাকলে লিনাক্স OOM কিলার অ্যাপ বন্ধ করে দেয়; সোয়াপ অস্থায়ী মেমোরি বাড়িয়ে ছোট স্পাইক সহনীয় করে।",
        purposeEn:
          "Small RAM plans hit OOM kills under load; swap adds emergency headroom so services survive brief spikes.",
        nodes: [
          {
            type: "p",
            bn: "সোয়াপ = ডিস্কের একটু জায়গা র‍্যামের মতো ব্যবহার করা (ধীর, কিন্তু OOM এড়ায়)। উদাহরণ: ১ GB RAM ড্রপলেটে `npm run build` + API একসাথে চললে RAM ফুল হয়ে লিনাক্স প্রসেস কিল করতে পারে; ২ GB সোয়াপ থাকলে অনেক সময় বেঁচে যায়।",
            en: "Swap = use a slice of disk like slow RAM (avoids sudden OOM). Example: on a 1 GB VPS, running `npm run build` plus your API together can exhaust RAM and trigger the OOM killer; a 2 GB swap file often absorbs the spike instead.",
          },
          {
            type: "p",
            bn: "ঐচ্ছিক কিন্তু: ৪ GB+ RAM আর হালকা ট্রাফিকে অনেকে সোয়াপ ছাড়াই চালায় — তবে স্পাইকে OOM ঝুঁকি থাকতে পারে।",
            en: "Often optional if you have plenty of RAM and light traffic—but spikes can still OOM without swap.",
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`,
          },
        ],
      },
      {
        id: "1-2",
        number: "1.2",
        titleBn: "সিস্টেম আপডেট",
        titleEn: "System update",
        purposeBn:
          "পুরনো কার্নেল/লাইব্রেরিতে নোন্নতম সিকিউরিটি প্যাচ থাকে না; আপডেট দিয়ে SSH ও সিস্টেম লাইব্রেরি নিরাপদ রাখা হয়।",
        purposeEn:
          "Stale packages miss security fixes; upgrades patch OpenSSL, SSH, and dependencies your stack relies on.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt update && sudo apt -y upgrade
sudo apt -y install curl git ufw fail2ban unattended-upgrades`,
          },
        ],
      },
      {
        id: "1-3",
        number: "1.3",
        titleBn: "ডিপ্লয় ইউজার ও SSH কী",
        titleEn: "Deploy user & SSH keys",
        purposeBn:
          "রুট দিয়ে ডেপ্লয় মানে একটা বাগেই পুরো সার্ভার ঝুঁকি; আলাদা ইউজার ও SSH কী পাসওয়ার্ড ব্রুটফোর্স কমায়।",
        purposeEn:
          "Deploying as root maximizes blast radius; a non-root user plus SSH keys removes password guessing and limits damage.",
        nodes: [
          {
            type: "p",
            bn: "ডিপ্লয় ইউজার = অ্যাপ ও ডেপ্লয় স্ক্রিপ্ট চালানোর আলাদা লিনাক্স অ্যাকাউন্ট (রুট নয়)। SSH কী জোড়া = ল্যাপটপে গোপন কী + সার্ভারে পাবলিক কী `authorized_keys` এ। উদাহরণ: একই `ssh-keygen` এর `.pub` GitHub এ ও সার্ভারের `deploy` ইউজারে লাগানো যায়।",
            en: "Deploy user = a non-root Linux account for running apps and deploy scripts. SSH keypair = private key on your laptop + public key in `authorized_keys` on the server. Example: the same `ssh-keygen` `.pub` can go to GitHub and to the `deploy` user on the server.",
          },
          {
            type: "infobox",
            variant: "skip",
            titleBn: "রুট দিয়েও ‘চলে’ কি?",
            titleEn: "Can I stay on root?",
            bodyBn:
              "হ্যাঁ, টেকনিক্যালি চলতে পারে — কিন্তু একটা নোড বাগ বা লিক হলে পুরো সার্ভার কম্প্রোমাইজের ঝুঁকি। প্রোডে নন-রুট + কী-অনলি SSH স্ট্যান্ডার্ড।",
            bodyEn:
              "Technically yes for a toy server—but one app bug or leak risks the whole machine. Non-root + key-based SSH is the production norm.",
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo adduser deploy
sudo usermod -aG sudo deploy
sudo rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy`,
          },
          {
            type: "code",
            lang: "bash",
            code: `# on your laptop
ssh-keygen -t ed25519 -C "deploy@yourdomain"`,
          },
          {
            type: "code",
            lang: "bash",
            code: `# append public key on server
sudo mkdir -p /home/deploy/.ssh
echo "YOUR_PUBLIC_KEY" | sudo tee -a /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys`,
          },
          {
            type: "code",
            file: "/etc/ssh/sshd_config",
            lang: "bash",
            code: `# recommended flags (merge carefully)
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
AllowUsers deploy`,
          },
        ],
      },
      {
        id: "1-4",
        optional: true,
        number: "1.4",
        titleBn: "SSH টু-ফ্যাক্টর (PAM)",
        titleEn: "SSH two-factor authentication",
        purposeBn:
          "কী লিক হলেও দ্বিতীয় ফ্যাক্টর ছাড়া লগইন কঠিন; উচ্চ-রিস্ক বা কমপ্লায়েন্সে সুপারিশ।",
        purposeEn:
          "If a laptop with a private key is stolen, MFA still blocks logins—useful for high-risk or regulated environments.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `# 1) install tools
sudo apt -y install libpam-google-authenticator qrencode

# 2) as deploy user
google-authenticator -t -d -f -r 3 -R 30 -W

# 3) edit PAM for sshd
echo "auth required pam_google_authenticator.so" | sudo tee -a /etc/pam.d/sshd

# 4) sshd_config — enable challenge-response + require MFA after pubkey
sudo nano /etc/ssh/sshd_config
# set: ChallengeResponseAuthentication yes
# append: AuthenticationMethods publickey,keyboard-interactive

# 5) keep sudo session safe (optional)
echo "auth required pam_google_authenticator.so" | sudo tee -a /etc/pam.d/sudo

# 6) reload
sudo systemctl reload ssh

# 7) TEST in a second session before closing the first

# 8) emergency: recovery console / IPMI if locked out

# 9) backup secret codes offline

# 10) rotate codes periodically`,
          },
        ],
      },
      {
        id: "1-5",
        number: "1.5",
        titleBn: "ফায়ারওয়াল (UFW)",
        titleEn: "Firewall (UFW)",
        purposeBn:
          "শুধু ২২/৮০/৪৪৩ খোলা রাখলে অপ্রয়োজনীয় পোর্ট বন্ধ থাকে; বট স্ক্যান করে যা পায় তা আক্রমণ করতে পারে না।",
        purposeEn:
          "Default-deny inbound closes services you forgot about; only explicitly allowed ports reach the internet.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`,
          },
        ],
      },
      {
        id: "1-6",
        number: "1.6",
        titleBn: "Fail2Ban",
        titleEn: "Fail2Ban",
        purposeBn:
          "বারবার ভুল পাসওয়ার্ড/SSH চেষ্টা আইপি ব্যান করে ব্রুটফোর্স ধীর করে; ফায়ারওয়াল একা প্যাটার্ন বুঝতে পারে না।",
        purposeEn:
          "Fail2Ban watches auth logs and bans noisy IPs—something a static firewall rule cannot infer from behavior.",
        nodes: [
          {
            type: "p",
            bn: "Fail2ban = লগ দেখে বারবার ব্যর্থ লগইন করা IP অস্থায়ী ব্যান। উদাহরণ: কেউ সেকেন্ডে ২০ বার ভুল পাসওয়ার্ড দিলে ১ ঘণ্টার জন্য ব্লক। SSH শুধু কী দিয়ে হলে ব্রুটফোর্স কম তবু লগ নজরদারি সুবিধা থাকে।",
            en: "Fail2ban reads auth logs and temporarily bans IPs that hammer failed logins. Example: 20 bad password attempts in a minute → ban for 1 hour. With SSH key-only, brute force is rarer, but Fail2ban still helps against noise and misconfigurations.",
          },
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ঐচ্ছিক কখন?",
            titleEn: "When is it optional?",
            bodyBn:
              "কী-অনলি SSH আর UFW ঠিক থাকলে অনেক ছোট সেটআপে Fail2ban ছাড়াও চলে — তবে পাসওয়ার্ড SSH খোলা থাকলে সুপারিশ।",
            bodyEn:
              "Many small setups run fine without Fail2ban if SSH is key-only and UFW is tight—but it is strongly recommended if password SSH exists.",
          },
          {
            type: "code",
            file: "/etc/fail2ban/jail.local",
            lang: "ini",
            code: `[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = systemd`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd`,
          },
        ],
      },
      {
        id: "1-7",
        optional: true,
        number: "1.7",
        titleBn: "CrowdSec",
        titleEn: "CrowdSec",
        purposeBn:
          "কমিউনিটি সিগন্যাল শেয়ার করে নতুন আক্রমণ প্যাটার্ন দ্রুত ব্লক করা যায়; Fail2Ban-এর বাইরে আরেক স্তর।",
        purposeEn:
          "CrowdSec adds crowd-sourced threat signals beyond local log rules—helpful when you face automated campaigns.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `curl -s https://packagecloud.io/install/repositories/crowdsec/crowdsec/script.deb.sh | sudo bash
sudo apt install crowdsec
sudo cscli hub update
sudo cscli collections install crowdsecurity/linux crowdsecurity/sshd
sudo systemctl enable --now crowdsec`,
          },
        ],
      },
    ],
  },
  {
    id: "section-2",
    index: 2,
    scope: "both",
    tier: "required",
    titleBn: "ডাটাবেজ সেটআপ",
    titleEn: "Database Setup",
    descriptionBn:
      "MongoDB, PostgreSQL+PgBouncer, Redis — ম্যানুয়াল বা ডকার পথে।",
    descriptionEn: "MongoDB, PostgreSQL+PgBouncer, Redis — manual or Docker.",
    whyBn: `অ্যাপের ডাটা যেখানে জমা হয় সেটাই সবচেয়ে মূল্যবান অংশ। ভুল ডিবি সেটআপ মানে স্লো কোয়েরি, ডাটা লস, বা লিক। ম্যানুয়াল পথে আপনি হোস্টে সরাসরি কন্ট্রোল; ডকার পথে একই ভার্সন ডেভ ও প্রোডে চালানো সহজ।
উদাহরণ: ইউজার ডাটা Mongo তে থাকলে বাইন্ড 127.0.0.1 + অথ বন্ধ করে শুধু অ্যাপকে ভিতরে অ্যাক্সেস দিন — বাইরে থেকে ডাটাবেজ পোর্ট খোলা রাখবেন না।`,
    whyEn: `Your database is usually the most valuable part of the system. A weak setup means slow queries, data loss, or leaks. Manual install gives tight host control; Docker makes “same version everywhere” easier.
Example: if you use MongoDB, bind to localhost and enable auth so only your app reaches it — never expose DB ports to the whole internet.`,
    subsections: [
      {
        id: "2a",
        number: "2A",
        titleBn: "MongoDB (ম্যানুয়াল)",
        titleEn: "MongoDB (manual)",
        purposeBn:
          "ডকুমেন্ট-স্টোর ডাটার জন্য Mongo সাধারণ; হোস্টে ইনস্টল করলে পারফরম্যান্স টিউন ও লগ সরাসরি হাতের নাগালে।",
        purposeEn:
          "Mongo fits document-heavy apps; native install gives direct tuning, logs, and backups on the host you control.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt -y install mongodb-org`,
          },
          {
            type: "code",
            file: "/etc/mongod.conf",
            lang: "yaml",
            code: `storage:
  dbPath: /var/lib/mongodb
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
security:
  authorization: enabled`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo systemctl enable --now mongod`,
          },
          {
            type: "code",
            lang: "bash",
            code: `mongosh <<'EOF'
use admin
db.createUser({ user: "admin", pwd: "STRONG_PASSWORD", roles: ["root"] })
use appdb
db.createUser({ user: "app", pwd: "STRONG_PASSWORD", roles: ["readWrite"] })
EOF`,
          },
        ],
      },
      {
        id: "2b",
        number: "2B",
        titleBn: "MongoDB (ডকার)",
        titleEn: "MongoDB (Docker)",
        purposeBn:
          "কম্পোজে Mongo চালালে ভার্সন ও ভলিউম একসাথে ট্র্যাক করা সহজ; নতুন সার্ভারে একই YAML দিয়ে উঠানো যায়।",
        purposeEn:
          "Running Mongo in Compose pins versions and volumes in one file—fast rebuild on another machine or CI.",
        scope: "docker",
        nodes: [
          {
            type: "infobox",
            variant: "docker",
            titleBn: "ডকার পথ",
            titleEn: "Docker path",
            bodyBn:
              "ডাটা ভলিউম মাউন্ট করুন, রুট পাসওয়ার্ড এনভ বা সিক্রেট ফাইলে রাখুন।",
            bodyEn:
              "Mount a data volume; keep root password in env or Docker secret.",
          },
          {
            type: "code",
            file: "docker-compose.snippet.yml",
            lang: "yaml",
            code: `services:
  mongo:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:`,
          },
        ],
      },
      {
        id: "2c",
        optional: true,
        number: "2C",
        titleBn: "PostgreSQL + PgBouncer (ম্যানুয়াল)",
        titleEn: "PostgreSQL + PgBouncer (manual)",
        purposeBn:
          "অনেক ছোট কানেকশন খুলে রাখা Postgresের জন্য ব্যয়বহুল; PgBouncer পুল করে ট্রানজ্যাকশন মোডে চাপ কমায়।",
        purposeEn:
          "High connection churn hurts Postgres; PgBouncer pools clients so your app can scale without exhausting server processes.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install postgresql postgresql-contrib pgbouncer`,
          },
          {
            type: "code",
            file: "/etc/pgbouncer/pgbouncer.ini",
            lang: "ini",
            code: `[databases]
app = host=127.0.0.1 port=5432 dbname=app

[pgbouncer]
listen_addr = 127.0.0.1
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 200
default_pool_size = 20`,
          },
          {
            type: "code",
            file: "/etc/pgbouncer/userlist.txt",
            lang: "bash",
            code: `"appuser" "SCRAM_HASH_FROM_postgres"`,
          },
        ],
      },
      {
        id: "2d",
        number: "2D",
        titleBn: "PostgreSQL (ডকার)",
        titleEn: "PostgreSQL (Docker)",
        purposeBn:
          "রিলেশনাল ডাটা ও মাইগ্রেশন টুলিংয়ের জন্য Postgres; ডকারে ডাটা ভলিউম আলাদা রাখলে কন্টেইনার রিবিল্ড নিরাপদ।",
        purposeEn:
          "Postgres is the default for relational data; a named volume keeps data safe when you recreate containers.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: "docker-compose.snippet.yml",
            lang: "yaml",
            code: `services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: app
    volumes:
      - pg_data:/var/lib/postgresql/data
volumes:
  pg_data:`,
          },
        ],
      },
      {
        id: "2e",
        number: "2E",
        titleBn: "Redis (ম্যানুয়াল)",
        titleEn: "Redis (manual)",
        purposeBn:
          "সেশন, রেট লিমিট, ক্যাশ, কিউ — দ্রুত ইন-মেমোরি স্টোর দরকার হলে Redis; লোকালহোস্ট বাইন্ড ও পাসওয়ার্ড বাধ্যতামূলক।",
        purposeEn:
          "Redis backs sessions, caches, and queues; bind locally and set a password so only your app can talk to it.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install redis-server`,
          },
          {
            type: "code",
            file: "/etc/redis/redis.conf",
            lang: "bash",
            code: `bind 127.0.0.1
protected-mode yes
requirepass STRONG_REDIS_PASSWORD
maxmemory 256mb
maxmemory-policy allkeys-lru`,
          },
        ],
      },
      {
        id: "2f",
        number: "2F",
        titleBn: "Redis (ডকার)",
        titleEn: "Redis (Docker)",
        purposeBn:
          "ডকারে Redis আলাদা সার্ভিস হিসেবে চালালে অ্যাপ রিবিল্ড করলেও ক্যাশ ডাটা ভলিউমে থাকে।",
        purposeEn:
          "Sidecar Redis in Compose survives app image updates when data lives in a volume.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: "docker-compose.snippet.yml",
            lang: "yaml",
            code: `services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--requirepass", "\${REDIS_PASSWORD}"]
    volumes:
      - redis_data:/data
volumes:
  redis_data:`,
          },
        ],
      },
    ],
  },
  {
    id: "section-3",
    index: 3,
    scope: "both",
    tier: "required",
    titleBn: "অ্যাপ্লিকেশন ডেপ্লয়মেন্ট",
    titleEn: "Application Deployment",
    descriptionBn:
      "Node.js + PM2 বা tmux (ম্যানুয়াল পথে বিকল্প) অথবা ডকার ইমেজ ও কম্পোজ — যেটা পছন্দ সেটা বেছে নিন।",
    descriptionEn:
      "Node.js + PM2 or tmux (alternative on the manual path), or Docker images and Compose—pick what fits you.",
    whyBn: `এখানে আসল কাজ: আপনার Node বিল্ডকে প্রোডাকশনে চালু করা এবং ক্র্যাশ হলে আবার উঠানো। PM2 দিয়ে ক্লাস্টার/রিস্টার্ট সহজ; tmux দিয়ে প্রসেস ম্যানেজার ছাড়াই সেশন ডিট্যাচ করে চালানো যায়; ডকার দিয়ে ইমেজে প্যাক করে একই কমান্ডে রোল আউট।
উদাহরণ: ট্রাফিক বাড়লে PM2-তে instances: "max" দিয়ে CPU কোর ব্যবহার করতে পারেন; ডকারে একই অ্যাপের নতুন ট্যাগ পুল করে zero-downtime ধরনের আপডেট সাজানো যায়।`,
    whyEn: `This is where your built Node app actually runs in production and survives crashes. PM2 gives simple clustering/restarts on the host; tmux keeps a long-lived shell session if you prefer no process manager; Docker packages the app so rollout is repeatable from an image tag.
Example: under load, PM2 cluster mode uses CPU cores; with Docker you pull a new image tag and recreate the service for a controlled rollout.`,
    subsections: [
      {
        id: "3a",
        number: "3A",
        titleBn: "Node.js + PM2 (ম্যানুয়াল)",
        titleEn: "Node.js + PM2 (manual)",
        purposeBn:
          "NVM দিয়ে নোড ভার্সন পিন, PM2 দিয়ে প্রসেস রিস্টার্ট/ক্লাস্টার — সরাসরি সার্ভারে দ্রুত ইটারেশনের জন্য।",
        purposeEn:
          "NVM pins Node versions per user; PM2 supervises processes—ideal when you want simple host-native deploys.",
        scope: "manual",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ডকার পথ ব্যবহার করলে",
            titleEn: "If you use the Docker path",
            bodyBn:
              "এই উপসেকশন এড়িয়ে যান — ডকার ইমেজ ও কম্পোজ দিয়ে ডেপ্লয় করুন।",
            bodyEn:
              "Skip this subsection — deploy with Docker images and Compose instead.",
          },
          {
            type: "code",
            lang: "bash",
            code: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install --lts
node -v`,
          },
          {
            type: "code",
            lang: "bash",
            code: `ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/deploy_ed25519 -N ""
cat ~/.ssh/deploy_ed25519.pub
# add read-only deploy key in Git provider`,
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo mkdir -p /var/www && sudo chown deploy:deploy /var/www
cd /var/www
git clone git@github.com:org/backend.git
git clone git@github.com:org/frontend.git
git clone git@github.com:org/dashboard.git`,
          },
          {
            type: "code",
            file: "/var/www/backend/ecosystem.config.js",
            lang: "bash",
            code: `module.exports = {
  apps: [{
    name: "api",
    cwd: "/var/www/backend",
    script: "dist/main.js",
    instances: "max",
    exec_mode: "cluster",
    env: { NODE_ENV: "production" }
  }]
};`,
          },
          {
            type: "code",
            file: "/var/www/frontend/ecosystem.config.js",
            lang: "bash",
            code: `module.exports = {
  apps: [{
    name: "web",
    cwd: "/var/www/frontend",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3000",
    env: { NODE_ENV: "production" }
  }]
};`,
          },
          {
            type: "code",
            file: "/var/www/dashboard/ecosystem.config.js",
            lang: "bash",
            code: `module.exports = {
  apps: [{
    name: "dash",
    cwd: "/var/www/dashboard",
    script: "dist/server.js",
    env: { NODE_ENV: "production" }
  }]
};`,
          },
          {
            type: "code",
            lang: "bash",
            code: `npm i -g pm2
cd /var/www/backend && npm ci && npm run build
cd /var/www/frontend && npm ci && npm run build
cd /var/www/dashboard && npm ci && npm run build
pm2 start /var/www/backend/ecosystem.config.js
pm2 start /var/www/frontend/ecosystem.config.js
pm2 start /var/www/dashboard/ecosystem.config.js
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy`,
          },
        ],
      },
      {
        id: "3b",
        number: "3B",
        titleBn: "ডকার ডেপ্লয়মেন্ট",
        titleEn: "Docker deployment",
        purposeBn:
          "মাল্টি-স্টেজ Dockerfile ইমেজ ছোট ও নিরাপদ রাখে; একই আর্টিফ্যাক্ট স্টেজিং ও প্রোডে চালানো যায়।",
        purposeEn:
          "Multi-stage builds shrink images and separate build tools from runtime—same artifact from CI to prod.",
        scope: "docker",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ম্যানুয়াল পথ ব্যবহার করলে",
            titleEn: "If you use the manual path",
            bodyBn:
              "এই উপসেকশন এড়িয়ে যান — ম্যানুয়াল পথে হোস্টে NVM, PM2 বা tmux ব্যবহার করুন।",
            bodyEn:
              "Skip this subsection — on the manual path use NVM with PM2 or tmux on the host.",
          },
          {
            type: "code",
            file: "Dockerfile",
            lang: "dockerfile",
            code: `# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER nonroot
CMD ["dist/main.js"]`,
          },
          {
            type: "code",
            lang: "bash",
            code: `docker compose build
docker compose up -d`,
          },
        ],
      },
      {
        id: "3c",
        number: "3C",
        titleBn: "tmux — PM2 ছাড়াই প্রসেস চালু রাখা",
        titleEn: "tmux — keep processes running without PM2",
        purposeBn:
          "PM2 ছাড়াই SSH সেশন ডিট্যাচ করে নোড/স্ক্রিপ্ট চালু রাখা যায়; ছোট সার্ভার বা পছন্দে বৈধ বিকল্প।",
        purposeEn:
          "Detachable terminal sessions keep Node or scripts running without PM2—a valid choice when you want minimal tooling.",
        scope: "manual",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ডকার পথ ব্যবহার করলে",
            titleEn: "If you use the Docker path",
            bodyBn:
              "এই উপসেকশন এড়িয়ে যান — ডকারে কন্টেইনারের restart পলিসি দিয়ে প্রসেস ম্যানেজ করুন।",
            bodyEn:
              "Skip this subsection — with Docker, supervise processes using container restart policies.",
          },
          {
            type: "infobox",
            variant: "manual",
            titleBn: "PM2 বনাম tmux",
            titleEn: "PM2 vs tmux",
            bodyBn:
              "PM2: ক্র্যাশে রিস্টার্ট, ক্লাস্টার, লগ রোটেশন, বুট স্টার্টআপ — প্রোড Node-এর জন্য সুবিধাজনক। tmux: হালকা, শুধু টার্মিনাল সেশন ডিট্যাচ; রিস্টার্ট/মেট্রিক্স নিজে দেখতে হবে। দুটোই একসাথে লাগবে না — একটি বেছে নিন।",
            bodyEn:
              "PM2: auto-restart, clustering, log handling, startup hooks—great for production Node. tmux: lightweight detach only—you handle restarts and monitoring yourself. You do not need both; pick one style.",
          },
          {
            type: "p",
            bn: "ইনস্টল: `sudo apt install -y tmux`। নতুন সেশন: `tmux new -s app`। ভেতরে অ্যাপ চালান (`node dist/main.js` বা `npm run start`)। কীবোর্ড থেকে ডিট্যাচ: Ctrl+b তারপর d। আবার ঢুকুন: `tmux attach -t app`। সেশন তালিকা: `tmux ls`।",
            en: "Install: `sudo apt install -y tmux`. New session: `tmux new -s app`. Run your app inside (`node dist/main.js` or `npm run start`). Detach: Ctrl+b then d. Reattach: `tmux attach -t app`. List: `tmux ls`.",
          },
          {
            type: "code",
            lang: "bash",
            code: `sudo apt update && sudo apt install -y tmux
tmux new -s api
# inside tmux: cd /var/www/backend && node dist/main.js
# detach: Ctrl+b  then  d
tmux attach -t api
tmux ls`,
          },
          {
            type: "p",
            bn: "সার্ভার রিবুট হলে tmux সেশন মুছে যায় — তখন systemd ইউনিট বা @reboot ক্রন দিয়ে আবার চালু করার পরিকল্পনা রাখুন, অথবা PM2 ব্যবহার করুন।",
            en: "Reboot clears tmux sessions—plan a systemd unit or @reboot cron to relaunch, or use PM2 if you want automatic restarts across reboots.",
          },
        ],
      },
    ],
  },
  {
    id: "section-4",
    index: 4,
    scope: "both",
    tier: "required",
    titleBn: "এনভায়রনমেন্ট ভেরিয়েবল",
    titleEn: "Environment Variables",
    descriptionBn:
      "ম্যানুয়ালে .env ফাইল; ডকারে কম্পোজ env_file বা সিক্রেট। ফাইল প্যাটার্ন দেখানো হয়েছে; সঠিক ভেরিয়েবল মান ছাড়া অ্যাপ ডাটাবেজ বা রেডিসে যোগ দিতে পারবে না।",
    descriptionEn:
      "Manual `.env` or Compose env files. This section shows the file pattern; without correct values (for example a valid `DATABASE_URL`) the app cannot reach your database or Redis.",
    whyBn: `সিক্রেট (API কী, DB পাসওয়ার্ড) কোডে হার্ডকোড করা মানে একবার লিক হলে সব পরিবেশ কম্প্রোমাইজ। .env বা কম্পোজ সিক্রেট দিয়ে কনফিগ আলাদা রাখা হয়।
উদাহরণ: ম্যানুয়ালে DATABASE_URL=127.0.0.1:5432 ঠিক আছে; ডকারে একই ভেরিয়েবল postgres:5432 (সার্ভিস নাম) হতে পারে — কপি-পেস্ট করলে কানেকশন ফেল করবে, তাই পথ অনুযায়ী আলাদা ফাইল রাখুন।`,
    whyEn: `Secrets must not live in git. .env / compose secrets separate config per environment and per deploy path.
Example: DATABASE_URL pointing to 127.0.0.1 is correct on a manual host; in Compose it often becomes postgres:5432 (service DNS). Copy-pasting the same URL across paths breaks connections.`,
    subsections: [
      {
        id: "4a",
        number: "4A",
        titleBn: "ম্যানুয়াল .env",
        titleEn: "Manual .env file",
        purposeBn:
          "অ্যাপ ডিরেক্টরিতে .env রেখে পোর্ট ও DB URI হোস্ট লোকালহোস্টে সেট করুন — PM2/Node সরাসরি পড়ে।",
        purposeEn:
          "Keep secrets beside the app with localhost URLs—PM2 and Node read them directly on the host.",
        scope: "manual",
        nodes: [
          {
            type: "infobox",
            variant: "warning",
            titleBn: "‘.env’ = কনফিগ, খালি রাখা যায় না",
            titleEn: "`.env` means config — empty wrong values break the app",
            bodyBn:
              "ফাইল নাম `.env` হোক বা অন্য — ভেরিয়েবলের মান সঠিক হতে হবে। উদাহরণ: `DATABASE_URL` এ ভুল হোস্ট দিলে `ECONNREFUSED` বা ORM এর “Can't reach database server”। ডকারে হোস্ট `postgres` (সার্ভিস নাম), ম্যানুয়ালে `127.0.0.1`।",
            bodyEn:
              "The filename can be `.env` or another convention—variable values must be correct. Example: wrong host in `DATABASE_URL` → `ECONNREFUSED` or ORM “Can't reach database server”. In Docker use the service hostname (e.g. `postgres`); on manual installs use `127.0.0.1`.",
          },
          {
            type: "code",
            file: "/var/www/backend/.env",
            lang: "bash",
            code: `NODE_ENV=production
PORT=4000
DATABASE_URL=mongodb://app:password@127.0.0.1:27017/appdb
REDIS_URL=redis://:password@127.0.0.1:6379`,
          },
        ],
      },
      {
        id: "4b",
        number: "4B",
        titleBn: "ডকার .env",
        titleEn: "Docker .env file",
        purposeBn:
          "কম্পোজ ডিরেক্টরির .env এ ইমেজ ট্যাগ ও পাসওয়ার্ড রাখা হয়; কন্টেইনারে হোস্টনেম সার্ভিস নাম হয়।",
        purposeEn:
          "Compose .env holds image tags and passwords; service hostnames differ from 127.0.0.1 on the host.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: ".env (compose directory)",
            lang: "bash",
            code: `POSTGRES_PASSWORD=change-me
MONGO_ROOT_PASSWORD=change-me
REDIS_PASSWORD=change-me
APP_IMAGE=ghcr.io/org/api:main`,
          },
        ],
      },
      {
        id: "4w",
        number: "4C",
        titleBn: "পার্থক্য ও সতর্কতা",
        titleEn: "Difference & warning",
        purposeBn:
          "দুই পথের কনফিগ এক রকম দেখালেও নেটওয়ার্ক নাম আলাদা — এখানে ভুল বুঝলে প্রোডে কানেকশন ফেল।",
        purposeEn:
          "Configs look similar but networking differs—this block prevents silent prod misconfiguration.",
        scope: "both",
        nodes: [
          {
            type: "infobox",
            variant: "warning",
            titleBn: "সতর্কতা",
            titleEn: "Warning",
            bodyBn:
              "ডকারে সার্ভিস হোস্টনেম কন্টেইনার নাম হয় (যেমন postgres)। ম্যানুয়ালে 127.0.0.1। একই DATABASE_URL দুই পথে কাজ নাও করতে পারে।",
            bodyEn:
              "In Docker, service hostnames are container names (e.g. postgres). On manual installs use 127.0.0.1. The same DATABASE_URL may not work across paths.",
          },
        ],
      },
    ],
  },
  {
    id: "section-5",
    index: 5,
    scope: "docker",
    tier: "optional",
    titleBn: "ডকার ফুল স্ট্যাক সেটআপ",
    titleEn: "Docker Full Stack Setup",
    descriptionBn:
      "ডকার ইঞ্জিন, প্রোডাকশন কম্পোজ, ব্যাকআপ কমান্ড। ম্যানুয়াল পথে এই সেকশন লুকানো।",
    descriptionEn:
      "Docker engine, production compose, backup commands. Hidden on the manual path.",
    whyBn: `ডকার পথে একই compose ফাইল দিয়ে অ্যাপ+ডিবি+ক্যাশ একসাথে উঠানো যায় — নতুন সার্ভারে “কম্পোজ আপ” মানেই একই স্ট্যাক। ইঞ্জিন ইনস্টল ও ভলিউম ব্যাকআপ ছাড়া প্রোড স্থায়ী হয় না।
উদাহরণ: postgres ডাটা ভলিউমে থাকলে ব্যাকআপ = ডাম্প বা ভলিউম আর্কাইভ; কন্টেইনার ডিলিট করলেও ডাটা থাকে যতক্ষণ ভলিউম মাউন্ট আছে।`,
    whyEn: `Compose lets you boot app + database + cache as one unit — a new server becomes “install Docker + compose up”. You still need engine install discipline and volume backups.
Example: Postgres data in a named volume survives container deletes; backups are dumps or volume archives, not “only the container”.`,
    subsections: [
      {
        id: "5-1",
        number: "5.1",
        titleBn: "ডকার ইনস্টল",
        titleEn: "Install Docker",
        purposeBn:
          "ইঞ্জিন ছাড়া compose চলবে না; ডিপ্লয় ইউজারকে docker গ্রুপে দিলে sudo ছাড়া বিল্ড করা যায়।",
        purposeEn:
          "Engine is mandatory; adding the deploy user to the docker group avoids sudo for day-to-day compose commands.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
newgrp docker`,
          },
        ],
      },
      {
        id: "5-2",
        number: "5.2",
        titleBn: "সম্পূর্ণ docker-compose.yml",
        titleEn: "Full docker-compose.yml",
        purposeBn:
          "এক ফাইলে সব সার্ভিসের নেটওয়ার্ক, ভলিউম, রিস্টার্ট পলিসি ডকুমেন্টেড থাকে — নতুন মেশিনে একই স্ট্যাক।",
        purposeEn:
          "One file documents networks, volumes, and restart policies—reproducible full stack on any fresh host.",
        nodes: [
          {
            type: "code",
            file: "docker-compose.yml",
            lang: "yaml",
            code: `services:
  api:
    image: \${APP_IMAGE}
    restart: unless-stopped
    env_file: .env.api
    depends_on: [postgres, redis]
    networks: [internal]

  web:
    image: \${WEB_IMAGE}
    restart: unless-stopped
    networks: [internal]

  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: app
    volumes: [pg_data:/var/lib/postgresql/data]
    networks: [internal]

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--requirepass", "\${REDIS_PASSWORD}"]
    volumes: [redis_data:/data]
    networks: [internal]

networks:
  internal: {}

volumes:
  pg_data:
  redis_data:`,
          },
        ],
      },
      {
        id: "5-3",
        number: "5.3",
        titleBn: "ডকার ব্যাকআপ কমান্ড",
        titleEn: "Docker backup commands",
        purposeBn:
          "কন্টেইনার মুছে গেলে ভলিউম থাকলেও অফসাইট ব্যাকআপ না থাকলে ডিস্ক ফেলে সব হারায়; ডাম্প/আর্কাইভ রুটিন লাগে।",
        purposeEn:
          "Volumes survive container deletes but not disk loss—scheduled dumps or volume archives are still required.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `# postgres dump
docker exec -t stack-postgres-1 pg_dump -U appuser app > backup.sql

# volume archive (example)
docker run --rm -v stack_pg_data:/v -v $(pwd):/backup alpine tar czf /backup/pg_volume.tgz -C /v .`,
          },
        ],
      },
    ],
  },
];
