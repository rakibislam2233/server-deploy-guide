import type { GuideSection } from "@/types/guide";

/** রেফারেন্স — PM2, ডকার, systemd, Nginx ইত্যাদি কমান্ড এক জায়গায় (কল্যাপসিবল)। */
export const guideSectionsPart4: GuideSection[] = [
  {
    id: "section-16",
    index: 16,
    scope: "both",
    tier: "optional",
    titleBn: "কমান্ড রেফারেন্স (PM2, tmux, ডকার, সিস্টেম)",
    titleEn: "Command reference (PM2, tmux, Docker, system)",
    descriptionBn:
      "নিচের ব্লকগুলো ক্লিক করে খুলুন — PM2, tmux, ডকার কম্পোজ, systemd, লগ ও Nginx দ্রুত কমান্ড।",
    descriptionEn:
      "Expand each block for PM2, tmux, Docker Compose, systemd, logs, and quick Nginx commands.",
    whyBn: `মূল গাইডে কমান্ড ছড়িয়ে থাকে; এখানে এক জায়গায় “কী চাইলে কী চালাব”। প্রোডে সব একসাথে চালাবেন না — বুঝে কপি করুন।
উদাহরণ: “লগ দেখতে” PM2 এ pm2 logs, ডকারে compose logs, সিস্টেম সার্ভিসে journalctl।`,
    whyEn: `The main guide scatters commands; this page groups “when I need X, run Y”. Do not paste everything into prod—copy what you understand.
Example: for logs use pm2 logs, docker compose logs, or journalctl depending on how the app runs.`,
    subsections: [
      {
        id: "16-1",
        number: "16.1",
        titleBn: "PM2 ও প্রসেস ম্যানেজমেন্ট",
        titleEn: "PM2 & process management",
        purposeBn:
          "ম্যানুয়াল পথে Node অ্যাপ চালাতে PM2 স্ট্যান্ডার্ড — স্টার্ট, রিলোড, লগ, মেট্রিক্স।",
        purposeEn:
          "PM2 is the common way to run Node apps on the manual path—start, reload, logs, and basic metrics.",
        nodes: [
          {
            type: "p",
            bn: "গ্লোবাল ইনস্টল: sudo npm i -g pm2। প্রথমবার: cd অ্যাপ ডিরেক্টরি থেকে pm2 start …",
            en: "Global install: sudo npm i -g pm2. First run from your app directory: pm2 start …",
          },
          {
            type: "collapsible",
            summaryBn: "▶ স্টার্ট / স্টপ / রিস্টার্ট / রিলোড",
            summaryEn: "▶ Start / stop / restart / reload",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 start ecosystem.config.js
pm2 start npm --name api -- start
pm2 stop api
pm2 restart api
pm2 reload api          # zero-downtime cluster reload (if app supports)
pm2 delete api`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ তালিকা, মনিটর, স্ট্যাটাস",
            summaryEn: "▶ List, monitor, status",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 list
pm2 status
pm2 monit
pm2 show api
pm2 describe api`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ লগ (লাইভ, লাইন লিমিট, ফ্লাশ)",
            summaryEn: "▶ Logs (live, line limit, flush)",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 logs
pm2 logs api
pm2 logs api --lines 200
pm2 flush              # clear all log files`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ স্টার্টআপে আবার চালু (boot)",
            summaryEn: "▶ Persist across reboot (startup)",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 save
pm2 startup              # prints a sudo command — run it once
pm2 unstartup systemd    # remove autostart (distro-specific)`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ আপডেট / ইনস্টল / ক্লাস্টার",
            summaryEn: "▶ Update / install / cluster",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 update               # update in-memory PM2
npm i -g pm2@latest && pm2 update

# ecosystem example: instances : "max" or number for cluster mode
pm2 scale api 4`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ এনভ ও ডিবাগ",
            summaryEn: "▶ Env & debug",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `pm2 env 0
pm2 restart api --update-env
NODE_ENV=production pm2 restart api --update-env`,
              },
            ],
          },
        ],
      },
      {
        id: "16-2",
        number: "16.2",
        titleBn: "Docker ও Compose",
        titleEn: "Docker & Compose",
        purposeBn:
          "ডকার পথে ইমেজ, কন্টেইনার, ভলিউম ও কম্পোজ এক লাইনে চালানোর রেফারেন্স।",
        purposeEn:
          "Quick reference for images, containers, volumes, and compose on the Docker path.",
        nodes: [
          {
            type: "collapsible",
            summaryBn: "▶ কম্পোজ (সাধারণ)",
            summaryEn: "▶ Compose (common)",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `docker compose ps
docker compose up -d
docker compose pull api
docker compose up -d --no-deps api
docker compose logs -f --tail=200 api
docker compose down`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ ইমেজ ও কন্টেইনার",
            summaryEn: "▶ Images & containers",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `docker images
docker ps -a
docker exec -it CONTAINER_NAME sh
docker stats --no-stream`,
              },
            ],
          },
        ],
      },
      {
        id: "16-3",
        number: "16.3",
        titleBn: "systemd ও লগ (journalctl)",
        titleEn: "systemd & journalctl",
        purposeBn:
          "Nginx বা সিস্টেম সার্ভিস ডিবাগ ও রিবুট পর স্ট্যাটাস দেখতে।",
        purposeEn:
          "Inspect native services (e.g. nginx, ssh) and logs after reboots or config changes.",
        nodes: [
          {
            type: "collapsible",
            summaryBn: "▶ systemctl",
            summaryEn: "▶ systemctl",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `sudo systemctl status nginx
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo systemctl is-active nginx`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ journalctl",
            summaryEn: "▶ journalctl",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
journalctl -xe`,
              },
            ],
          },
        ],
      },
      {
        id: "16-4",
        number: "16.4",
        titleBn: "Nginx, সার্ট, ডিস্ক",
        titleEn: "Nginx, certs, disk",
        purposeBn:
          "সাইট কনফিগ টেস্ট, সার্ট রিনিউ, ডিস্ক ফুল হলে দ্রুত চেক।",
        purposeEn:
          "Test nginx config, renew certs, quick disk checks when something breaks.",
        nodes: [
          {
            type: "collapsible",
            summaryBn: "▶ Nginx + Certbot",
            summaryEn: "▶ Nginx + Certbot",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
sudo certbot renew`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ ডিস্ক ও মেমোরি",
            summaryEn: "▶ Disk & memory",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `df -h
du -sh /var/log/* | sort -h | tail
free -h`,
              },
            ],
          },
        ],
      },
      {
        id: "16-5",
        number: "16.5",
        titleBn: "tmux দ্রুত রেফারেন্স",
        titleEn: "tmux quick reference",
        purposeBn:
          "ম্যানুয়াল পথে PM2 ছাড়া চালালে সেশন, ডিট্যাচ ও রিকভারি এক নজরে।",
        purposeEn:
          "One-page cheatsheet when you run the stack without PM2—sessions, detach, and recovery.",
        nodes: [
          {
            type: "p",
            bn: "সেশন নাম দিয়ে চালান (`tmux new -s api`) যাতে রিবুটের পর `attach` সহজ হয়।",
            en: "Always name sessions (`tmux new -s api`) so reattach is obvious after many tabs or teammates.",
          },
          {
            type: "collapsible",
            summaryBn: "▶ সেশন ও উইন্ডো",
            summaryEn: "▶ Sessions & windows",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `tmux new -s work
tmux ls
tmux attach -t work
tmux kill-session -t work

# prefix key default: Ctrl+b
# new window: Ctrl+b  c
# next/prev window: Ctrl+b  n  /  Ctrl+b  p`,
              },
            ],
          },
          {
            type: "collapsible",
            summaryBn: "▶ স্ক্রল ও কপি (কপি মোড)",
            summaryEn: "▶ Scroll & copy (copy mode)",
            body: [
              {
                type: "code",
                lang: "bash",
                code: `# enter copy mode: Ctrl+b  [
# navigate with vi keys or arrows; q to quit copy mode`,
              },
            ],
          },
          {
            type: "infobox",
            variant: "manual",
            titleBn: "PM2 না থাকলে",
            titleEn: "Without PM2",
            bodyBn:
              "ক্র্যাশ বা রিবুটের পর প্রসেস আবার চালু হয় না — systemd সার্ভিস, ক্রন, বা হাতে `attach` করে স্ক্রিপ্ট চালানোর পরিকল্পনা রাখুন।",
            bodyEn:
              "Nothing auto-restarts after crash or reboot unless you add systemd, cron, or a manual procedure—plan for that if you skip PM2.",
          },
        ],
      },
    ],
  },
];
