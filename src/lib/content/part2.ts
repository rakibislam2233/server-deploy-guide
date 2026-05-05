import type { GuideSection } from "@/types/guide";

export const guideSectionsPart2: GuideSection[] = [
  {
    id: "section-6",
    index: 6,
    scope: "both",
    tier: "recommended",
    titleBn: "Nginx — রিভার্স প্রক্সি",
    titleEn: "Nginx — Reverse Proxy",
    descriptionBn:
      "ইনস্টল, শেয়ার্ড proxy_params, API/ফ্রন্ট/ড্যাশবোর্ড সাইট, সাইট সক্রিয়করণ।",
    descriptionEn:
      "Install, shared proxy_params, API/front/dashboard sites, enable commands.",
    whyBn: `ব্রাউজার শুধু ৮০/৪৪৩ দেখে; আপনার Node অ্যাপ আলাদা পোর্টে চলে। Nginx রিভার্স প্রক্সি দিয়ে ডোমেইন → লোকাল পোর্ট ব্রিজ করেন, SSL এক জায়গায় টার্মিনেট করতে পারেন।
উদাহরণ: api.example.com → 127.0.0.1:4000, ওয়েব example.com → 3000 — এক সার্ভারে একাধিক অ্যাপ একই আইপিতে।`,
    whyEn: `Browsers speak HTTP/S on 80/443; your Node apps usually listen on other ports. Nginx terminates TLS and routes hostnames to the correct upstream.
Example: api.example.com → 127.0.0.1:4000 and example.com → 3000 lets multiple apps share one public IP cleanly.`,
    subsections: [
      {
        id: "6-1",
        number: "6.1",
        titleBn: "Nginx ইনস্টল",
        titleEn: "Install Nginx",
        purposeBn:
          "রিভার্স প্রক্সি ও স্ট্যাটিক ফাইল সার্ভ করার জন্য Nginx স্ট্যান্ডার্ড; সিস্টেম সার্ভিস হিসেবে সহজে রিলোড।",
        purposeEn:
          "Nginx is the usual front door for TLS and routing to your Node upstreams; installs cleanly as a systemd service.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install nginx
sudo systemctl enable --now nginx`,
          },
        ],
      },
      {
        id: "6-2",
        number: "6.2",
        titleBn: "proxy_params শেয়ার্ড ফাইল",
        titleEn: "Shared proxy_params file",
        purposeBn:
          "হেডার ও আপগ্রেড ম্যাপ এক জায়গায় রাখলে তিনটি সাইট ব্লকে কপি-পেস্ট কমে, ভুলও কমে।",
        purposeEn:
          "Centralizing proxy headers and websocket maps avoids drift across multiple server blocks.",
        nodes: [
          {
            type: "infobox",
            variant: "skip",
            titleBn: "ফাইলটা কি বাধ্যতামূলক?",
            titleEn: "Is this file mandatory?",
            bodyBn:
              "না — সংগঠনের জন্য। একই `proxy_set_header` লাইনগুলো প্রতিটি `server { }` ব্লকের ভিতরে সরাসরি লিখলেও Nginx চলবে। শেয়ার্ড ফাইল থাকলে তিনটা সাইটে এক জায়গায় এডিট, কপি-পেস্ট ভুল কমে।",
            bodyEn:
              "No—for maintainability. Nginx works if you paste the same `proxy_set_header` lines inside each `server { }` block. A shared `proxy_params` file means one place to edit for three vhosts and fewer copy-paste mistakes.",
          },
          {
            type: "code",
            file: "/etc/nginx/proxy_params",
            lang: "nginx",
            code: `proxy_http_version 1.1;
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;`,
          },
        ],
      },
      {
        id: "6-3",
        number: "6.3",
        titleBn: "Backend API সাইট",
        titleEn: "Backend API site",
        purposeBn:
          "API আলাদা হোস্টনেমে রাখলে কুকি, রেট লিমিট ও সার্ট আলাদা নিয়ন্ত্রণ করা সহজ।",
        purposeEn:
          "Splitting the API onto its own hostname isolates cookies, rate limits, and certificates from the public site.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/sites-available/api.yourdomain.com",
            lang: "nginx",
            code: `map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:4000;
  }
}`,
          },
        ],
      },
      {
        id: "6-4",
        number: "6.4",
        titleBn: "ফ্রন্টএন্ড সাইট",
        titleEn: "Frontend site",
        purposeBn:
          "ইউজার-ফেসিং অ্যাপ সাধারণত মেইন ডোমেইনে; এখানে Next/SPA আপস্ট্রিম পাস করা হয়।",
        purposeEn:
          "Public web traffic hits the main domain; this block forwards to your Next/SPA listening locally.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/sites-available/yourdomain.com",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:3000;
  }
}`,
          },
        ],
      },
      {
        id: "6-5",
        number: "6.5",
        titleBn: "ড্যাশবোর্ড সাইট",
        titleEn: "Dashboard site",
        purposeBn:
          "অ্যাডমিন/অ্যানালিটিক্স আলাদা সাবডোমেইনে রাখলে অ্যাক্সেস নিয়ন্ত্রণ ও ক্যাশ রুল আলাদা করা যায়।",
        purposeEn:
          "Admin UIs benefit from a separate subdomain for tighter access rules and caching behavior.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/sites-available/dashboard.yourdomain.com",
            lang: "nginx",
            code: `server {
  listen 80;
  server_name dashboard.yourdomain.com;

  location / {
    include proxy_params;
    proxy_pass http://127.0.0.1:4100;
  }
}`,
          },
        ],
      },
      {
        id: "6-6",
        number: "6.6",
        titleBn: "সাইট সক্রিয়করণ",
        titleEn: "Enable all sites",
        purposeBn:
          "sites-available থেকে sites-enabled সিমলিংক দিয়ে সাইট চালু; nginx -t দিয়ে সিনট্যাক্স চেক করুন।",
        purposeEn:
          "Symlinks enable vhosts; always run nginx -t before reload to catch syntax errors early.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dashboard.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
    ],
  },
  {
    id: "section-7",
    index: 7,
    scope: "both",
    tier: "optional",
    titleBn: "অ্যাডভান্স সিকিউরিটি — WAF ও SSL",
    titleEn: "Advanced Security — WAF & SSL",
    descriptionBn:
      "মাঝারি/বড় ট্রাফিক বা কমপ্লায়েন্সের জন্য। ছোট অ্যাপে নিচের সাবসেকশনগুলো সাধারণত ঐচ্ছিক।",
    descriptionEn:
      "For medium/large traffic or compliance. Subsections below are usually optional on small apps.",
    whyBn: `বেসিক ফায়ারওয়াল IP ফিল্টার করে; WAF/রেটলিমিট অ্যাপ লেয়ারের আক্রমণ (SQLi, স্ক্রিপ্টিং) কমায়। SSL হার্ডেনিং ব্রাউজারকে পুরনো সাইফার ব্যবহার করতে বাধা দেয়।
উদাহরণ: হঠাৎ ট্রাফিক স্পাইকে limit_req জোন দিয়ে API রুট সুরক্ষিত করতে পারেন; ছোট সাইটে শুধু Certbot+Nginx যথেষ্ট হলে WAF পরে যোগ করুন।`,
    whyEn: `Firewalls filter IPs; WAF + rate limits reduce application-layer abuse. TLS hardening removes weak ciphers and adds HSTS so browsers enforce HTTPS.
Example: rate-limit /api on Nginx when you see scraping spikes; on a tiny site, start with Certbot + sane headers and add ModSecurity later.`,
    subsections: [
      {
        id: "7-1",
        optional: true,
        number: "7.1",
        titleBn: "ModSecurity WAF",
        titleEn: "ModSecurity WAF",
        purposeBn:
          "অ্যাপ কোডের বাইরে কমন ওয়েব আক্রমণ ফিল্টার করতে WAF; ট্রাফিক বেশি হলে বেশি দরকার।",
        purposeEn:
          "A WAF blocks common web exploits before they hit your app—more valuable as traffic and risk grow.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install libnginx-mod-http-modsecurity
sudo mkdir -p /etc/nginx/modsec
sudo wget -qO /etc/nginx/modsec/modsecurity.conf https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended`,
          },
          {
            type: "code",
            file: "/etc/nginx/modsec/main.conf",
            lang: "nginx",
            code: `Include /etc/nginx/modsec/modsecurity.conf
SecRuleEngine On`,
          },
          {
            type: "code",
            lang: "bash",
            code: `echo "modsecurity on;" | sudo tee /etc/nginx/modsec/modsec-enable.conf
sudo nginx -t && sudo systemctl reload nginx`,
          },
        ],
      },
      {
        id: "7-2",
        optional: true,
        number: "7.2",
        titleBn: "DDoS সুরক্ষা (Nginx)",
        titleEn: "DDoS protection (Nginx)",
        purposeBn:
          "সস্তা বট ট্রাফিক বা রিপিটেড রিকোয়েস্ট এজে কেটে অ্যাপ সার্ভার সুরক্ষিত রাখে।",
        purposeEn:
          "Basic rate/connection limits at the edge absorb noisy bots so your Node process stays responsive.",
        nodes: [
          {
            type: "code",
            file: "/etc/nginx/conf.d/ddos-protection.conf",
            lang: "nginx",
            code: `limit_req_zone $binary_remote_addr zone=perip:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
  limit_req zone=perip burst=20 nodelay;
  limit_conn addr 20;
}`,
          },
        ],
      },
      {
        id: "7-3",
        optional: true,
        number: "7.3",
        titleBn: "SSL হার্ডেনিং",
        titleEn: "SSL hardening",
        purposeBn:
          "Let's Encrypt সার্ট পেলেও দুর্বল সাইফার বা HSTS ছাড়া ব্রাউজার স্কোর ও সিকিউরিটি কমে।",
        purposeEn:
          "After issuance, tighten protocols/ciphers and add HSTS so browsers enforce modern TLS behavior.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`,
          },
          {
            type: "code",
            file: "/etc/nginx/snippets/ssl-hardening.conf",
            lang: "nginx",
            code: `ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;`,
          },
          {
            type: "p",
            bn: "সার্ট ইস্যুর পরে SSL ল্যাবস বা মজিলা অবজারভেটরি দিয়ে গ্রেড পরীক্ষা করুন।",
            en: "After issuance, verify grade with SSL Labs or Mozilla Observatory.",
          },
        ],
      },
    ],
  },
  {
    id: "section-8",
    index: 8,
    scope: "both",
    tier: "optional",
    titleBn: "Cloudflare Tunnel",
    titleEn: "Cloudflare Tunnel",
    descriptionBn:
      "আউটবাউন্ড টানেল ও ড্যাশবোর্ড টিউনিং — প্রায়ই ঐচ্ছিক; সরাসরি Nginx+SSL যথেষ্ট হলে এড়িয়ে যেতে পারেন।",
    descriptionEn:
      "Tunneling and dashboard tuning — often optional if Nginx + SSL on the VPS is enough.",
    whyBn: `কখন দরকার: যখন আপনি অরিজিন সার্ভারে ইনবাউন্ড পোর্ট খুলতে চান না (CGNAT, অফিস নেট, বা শুধু আউটবাউন্ড)। cloudflared আউটবাউন্ড টানেল করে ট্রাফিক এনে দেয়।
উদাহরণ: হোম ল্যাবে API চালু কিন্তু রাউটারে পোর্ট ফরওয়ার্ড নেই — টানেল দিয়ে পাবলিক URL পাবেন; ড্যাশবোর্ডে SSL মোড Full (strict) রাখলে সার্ট চেইন ভুল হলে লুপ ব্রেক হতে পারে।`,
    whyEn: `Use a tunnel when you cannot (or will not) open inbound ports on the origin—CGNAT, locked-down networks, or “outbound-only” security models.
Example: demo API from a home lab without port-forwarding; set Cloudflare SSL to Full (strict) only when your origin TLS is correct or you’ll get redirect/cipher loops.`,
    subsections: [
      {
        id: "8-1",
        optional: true,
        number: "8.1",
        titleBn: "ইনস্টল ও কনফিগ",
        titleEn: "Install & configure tunnel",
        purposeBn:
          "ইনবাউন্ড পোর্ট খোলা ছাড়াই পাবলিক URL দরকার হলে টানেল; ক্লাউডফ্লেয়ার DNS রুট সহ।",
        purposeEn:
          "Use a tunnel when inbound ports are blocked; pairs with Cloudflare DNS routes to expose services safely.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb`,
          },
          { type: "code", lang: "bash", code: `cloudflared tunnel login` },
          { type: "code", lang: "bash", code: `cloudflared tunnel create prod` },
          {
            type: "code",
            lang: "bash",
            code: `cloudflared tunnel route dns prod api.yourdomain.com`,
          },
        ],
      },
      {
        id: "8-2",
        optional: true,
        number: "8.2",
        titleBn: "ড্যাশবোর্ড সেটিংস",
        titleEn: "Dashboard settings",
        purposeBn:
          "ক্লাউডফ্লেয়ারে SSL মোড, ক্যাশ ও বট ফাইট ভুল হলে লুপ বা ভাঙা সাইট হয়; চেকলিস্ট মেনে চলুন।",
        purposeEn:
          "Wrong SSL mode or aggressive caching breaks SPAs; this table sets safe defaults for proxied origins.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["সেটিং", "সুপারিশকৃত মান"],
              en: ["Setting", "Recommended value"],
            },
            rows: [
              {
                bn: ["SSL মোড", "Full (strict)"],
                en: ["SSL mode", "Full (strict)"],
              },
              {
                bn: ["Always HTTPS", "চালু"],
                en: ["Always HTTPS", "On"],
              },
              {
                bn: ["Bot Fight Mode", "চালু (প্রয়োজনে)"],
                en: ["Bot Fight Mode", "On (as needed)"],
              },
              {
                bn: ["WAF", "ম্যানেজড রুলস"],
                en: ["WAF", "Managed rulesets"],
              },
              {
                bn: ["Rate Limiting", "API এন্ডপয়েন্টে থ্রেশহোল্ড"],
                en: ["Rate limiting", "Thresholds on API routes"],
              },
              {
                bn: ["Cache Rules", "HTML নো-ক্যাশ, স্ট্যাটিক লং-ক্যাশ"],
                en: ["Cache rules", "Bypass HTML, long-cache static"],
              },
              {
                bn: ["Rocket Loader", "বন্ধ (SPA/Next এ সমস্যা হতে পারে)"],
                en: ["Rocket Loader", "Off (can break SPA/Next)"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "section-9",
    index: 9,
    scope: "both",
    tier: "optional",
    titleBn: "Prometheus + Grafana মনিটরিং",
    titleEn: "Prometheus + Grafana Monitoring",
    descriptionBn:
      "প্রোডাকশন পর্যবেক্ষণ — ছোট প্রোজেক্টে ঐচ্ছিক; মাঝারি/বড় দলের জন্য সুপারিশ।",
    descriptionEn:
      "Production observability — optional for tiny projects; recommended for medium/large teams.",
    whyBn: `মেট্রিক্স দিয়ে বুঝবেন CPU/RAM/ডিস্ক কখন শেষ হচ্ছে, কোন সার্ভিস ডাউন। Grafana দিয়ে চার্ট; Uptime Kuma দিয়ে বাইরে থেকে HTTP চেক।
উদাহরণ: Node মেমরি লিক হলে Grafana গ্রাফে ধীরে ধীরে RAM বাড়া দেখা যায়; আপটাইম টুল আলার্ট দেয় “৫০২ শুরু হয়েছে”।`,
    whyEn: `Metrics answer “why is it slow?” before users complain—CPU saturation, disk full, DB latency. Dashboards make trends obvious; uptime checks alert when HTTP fails.
Example: a memory leak shows as a slow RAM climb in Grafana; an external ping catches 502s when Nginx can’t reach upstream.`,
    subsections: [
      {
        id: "9-1",
        optional: true,
        number: "9.1",
        titleBn: "Prometheus ইনস্টল",
        titleEn: "Install Prometheus",
        purposeBn:
          "মেট্রিক্স টাইম সিরিজে জমা করে অ্যানোমালি ধরতে; node exporter সহ সার্ভার হেলথ দেখা যায়।",
        purposeEn:
          "Prometheus scrapes metrics so you can alert on saturation trends before users notice slowdowns.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `cd /tmp
VER=$(curl -s https://api.github.com/repos/prometheus/prometheus/releases/latest | grep tag_name | cut -d '"' -f4)
VERFILE=$(echo "$VER" | sed 's/^v//')
wget "https://github.com/prometheus/prometheus/releases/download/\${VER}/prometheus-\${VERFILE}.linux-amd64.tar.gz"
tar xvf prometheus-*.linux-amd64.tar.gz
sudo mv prometheus-*.linux-amd64 /opt/prometheus`,
          },
          {
            type: "code",
            file: "/opt/prometheus/prometheus.yml",
            lang: "yaml",
            code: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: node
    static_configs:
      - targets: ["127.0.0.1:9100"]`,
          },
        ],
      },
      {
        id: "9-2",
        optional: true,
        number: "9.2",
        titleBn: "Grafana ইনস্টল",
        titleEn: "Install Grafana",
        purposeBn:
          "শুধু সংখ্যা নয় চার্ট দরকার হলে Grafana; টিমকে একই ড্যাশবোর্ড শেয়ার করা সহজ।",
        purposeEn:
          "Grafana turns raw metrics into dashboards your team can share during incidents and capacity planning.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt update && sudo apt -y install grafana
sudo systemctl enable --now grafana-server`,
          },
        ],
      },
      {
        id: "9-3",
        optional: true,
        number: "9.3",
        titleBn: "ড্যাশবোর্ড আইডি",
        titleEn: "Dashboard IDs",
        purposeBn:
          "প্রস্তুত ড্যাশবোর্ড আইডি দিয়ে দ্রুত Node/DB/Docker ভিউ আমদানি — নিজে সব প্যানেল বানানোর সময় বাঁচে।",
        purposeEn:
          "Community dashboard IDs bootstrap useful panels instead of building every graph from scratch.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["আইডি", "বিবরণ"],
              en: ["ID", "Description"],
            },
            rows: [
              { bn: ["1860", "Node Exporter Full"], en: ["1860", "Node Exporter Full"] },
              { bn: ["3662", "Prometheus 2.0"], en: ["3662", "Prometheus 2.0"] },
              { bn: ["7362", "MongoDB"], en: ["7362", "MongoDB"] },
              { bn: ["9628", "PostgreSQL"], en: ["9628", "PostgreSQL"] },
              { bn: ["11835", "Redis"], en: ["11835", "Redis"] },
              { bn: ["12708", "Docker"], en: ["12708", "Docker"] },
            ],
          },
        ],
      },
      {
        id: "9-4",
        optional: true,
        number: "9.4",
        titleBn: "Uptime Kuma",
        titleEn: "Uptime Kuma",
        purposeBn:
          "বাইরে থেকে HTTP পিং করে ডাউনটাইম নোটিফিকেশন; মেট্রিক্সের পাশাপাশি ইউজার-ফেসিং চেক।",
        purposeEn:
          "Synthetic checks complement metrics by proving the site is reachable the way a customer sees it.",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1`,
          },
        ],
      },
    ],
  },
  {
    id: "section-10",
    index: 10,
    scope: "both",
    tier: "recommended",
    titleBn: "স্টেজিং ও Git ওয়ার্কফ্লো",
    titleEn: "Staging Environment & Git Workflow",
    descriptionBn:
      "ব্রাঞ্চিং ও ডেপ্লয় ফ্লো সবার জন্য; পৃথক স্টেজিং সার্ভার ঐচ্ছিক (ছোট টিমে প্রায়ই মেইন+ট্যাগই যথেষ্ট)।",
    descriptionEn:
      "Branching and deploy flow for everyone; separate staging servers are optional (small teams often ship from main + tags).",
    whyBn: `ব্রাঞ্চ মডেল দিয়ে কোড কোথায় মার্জ হবে স্পষ্ট হয় — প্রোড শুধু main থেকে। স্টেজিং সার্ভার দিয়ে ক্লায়েন্ট UAT বা ইন্টিগ্রেশন টেস্ট আলাদা রাখা যায়।
উদাহরণ: feature/login → PR → staging এ মার্জ → QA OK হলে main → প্রোড ডেপ্লয়; হটফিক্স ব্রাঞ্চ দিয়ে জরুরি প্যাচ আলাদা ট্র্যাক করুন।`,
    whyEn: `Branching defines where code is allowed to land—production should only move from a protected branch. Staging mirrors prod data/config at lower risk.
Example: feature/login → PR → merge to staging → QA sign-off → merge to main → deploy; hotfix/* for emergency patches with a shorter path.`,
    subsections: [
      {
        id: "10-1",
        number: "10.1",
        titleBn: "Git ব্রাঞ্চিং",
        titleEn: "Git branching",
        purposeBn:
          "কোন ব্রাঞ্চে কী ধরনের কোড থাকবে স্পষ্ট করলে রিলিজ ও হটফিক্স ট্র্যাক করা সহজ।",
        purposeEn:
          "Branch rules clarify where integrations happen versus what is allowed to reach production.",
        nodes: [
          {
            type: "table",
            headers: {
              bn: ["ব্রাঞ্চ", "উদ্দেশ্য"],
              en: ["Branch", "Purpose"],
            },
            rows: [
              { bn: ["main", "প্রোডাকশন"], en: ["main", "Production"] },
              { bn: ["staging", "প্রি-প্রোড ইন্টিগ্রেশন"], en: ["staging", "Pre-prod integration"] },
              { bn: ["develop", "ডেভ ইন্টিগ্রেশন"], en: ["develop", "Dev integration"] },
              { bn: ["feature/*", "ফিচার কাজ"], en: ["feature/*", "Feature work"] },
              { bn: ["hotfix/*", "জরুরি প্যাচ"], en: ["hotfix/*", "Emergency patch"] },
            ],
          },
        ],
      },
      {
        id: "10-2",
        optional: true,
        number: "10.2",
        titleBn: "স্টেজিং (ম্যানুয়াল)",
        titleEn: "Staging (manual)",
        purposeBn:
          "প্রোডের আগে আলাদা .env ও পোর্টে চালিয়ে রিগ্রেশন ধরা; PM2 এ আলাদা env দিয়ে চালানো যায়।",
        purposeEn:
          "Manual staging mirrors prod config on separate ports/env files before you promote to main.",
        scope: "manual",
        nodes: [
          {
            type: "code",
            lang: "bash",
            code: `sudo mkdir -p /var/www/staging && sudo chown deploy:deploy /var/www/staging
cd /var/www/staging
git clone -b staging git@github.com:org/backend.git
cp /var/www/staging/backend/.env.example /var/www/staging/backend/.env.staging
# edit DATABASE_URL, secrets for staging
cd /var/www/staging/backend && npm ci && npm run build
pm2 start ecosystem.config.js --env staging`,
          },
        ],
      },
      {
        id: "10-3",
        optional: true,
        number: "10.3",
        titleBn: "স্টেজিং (ডকার)",
        titleEn: "Staging (Docker)",
        purposeBn:
          "compose override দিয়ে স্টেজিং ইমেজ ট্যাগ ও পোর্ট আলাদা রেখে একই রিপো থেকে টেস্ট।",
        purposeEn:
          "Compose overrides swap image tags/ports so staging runs beside prod definitions without fork drift.",
        scope: "docker",
        nodes: [
          {
            type: "code",
            file: "docker-compose.staging.yml",
            lang: "yaml",
            code: `services:
  api:
    image: ghcr.io/org/api:staging
    env_file: .env.staging
    ports: ["4001:4000"]`,
          },
        ],
      },
      {
        id: "10-4",
        number: "10.4",
        titleBn: "ডেপ্লয় ফ্লো",
        titleEn: "Deployment flow",
        purposeBn:
          "ফিচার থেকে প্রোড পর্যন্ত ধাপ লিখে রাখলে টিম একই রিদমে রিলিজ করে; UAT বাদ দিলে ঝুঁকি বাড়ে।",
        purposeEn:
          "An ordered flow keeps QA/UAT explicit so releases are predictable instead of “merge and hope”.",
        nodes: [
          {
            type: "ol",
            items: [
              {
                bn: "ফিচার ব্রাঞ্চে কাজ ও PR",
                en: "Work on feature branch & open PR",
              },
              {
                bn: "স্টেজিংয়ে মার্জ ও স্বয়ংক্রিয়/ম্যানুয়াল টেস্ট",
                en: "Merge to staging & automated/manual tests",
              },
              {
                bn: "স্টেকহোল্ডার UAT",
                en: "Stakeholder UAT",
              },
              {
                bn: "মেইনে মার্জ (প্রোড)",
                en: "Merge to main (prod)",
              },
              {
                bn: "বিল্ড আর্টিফ্যাক্ট/ইমেজ তৈরি",
                en: "Build artifact/image",
              },
              {
                bn: "ব্যাকআপ নিশ্চিত",
                en: "Verify backups",
              },
              {
                bn: "রোলিং ডেপ্লয়",
                en: "Rolling deploy",
              },
              {
                bn: "পোস্ট-ডেপ্লয় স্বাস্থ্য পরীক্ষা",
                en: "Post-deploy health checks",
              },
            ],
          },
        ],
      },
    ],
  },
];
