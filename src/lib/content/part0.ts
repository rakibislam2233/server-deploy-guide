import type { GuideSection } from "@/types/guide";

export const guideSectionsPart0: GuideSection[] = [
  {
    id: "section-0",
    index: 0,
    scope: "both",
    tier: "required",
    titleBn: "সার্ভারে প্রবেশ — VPS ও AWS",
    titleEn: "Accessing your server — VPS & AWS",
    descriptionBn:
      "প্রোভাইডার প্যানেল থেকে IP ও লগইন পদ্ধতি বুঝে প্রথম SSH। AWS হলে `.pem` যে ফোল্ডারে আছে সেখানে `cd`, `chmod 400`, তারপর `ssh -i`। ডোমেন কিনে DNS এ ভিপিএস IP পয়েন্ট করা (Namecheap, GoDaddy)।",
    descriptionEn:
      "SSH using your provider IP and rules; on AWS `cd` to your `.pem`, `chmod 400`, then `ssh -i`. Point a purchased domain to your VPS (Namecheap, GoDaddy DNS).",
    whyBn: `গাইডের বাকি অংশ SSH দিয়ে সার্ভারে ঢুকে কমান্ড চালানো ধরে নেয়। নতুনরা প্রায়ই “কোথায় লগইন?” এ আটকে — প্রোভাইডার ভিন্ন হলে ধাপ ভিন্ন (ইমেইলে রুট পাসওয়ার্ড vs শুধু SSH কী, AWS তে সিকিউরিটি গ্রুপে ২২ খোলা)।
উদাহরণ: DigitalOcean ড্রপলেট তৈরি করলে ইমেইলে IP ও রুট পাসওয়ার্ড; AWS EC2 তে কী পেয়ার বেছে নিয়ে ইন্সট্যান্স স্টার্ট, তারপর “Connect” থেকে SSH কমান্ড কপি।`,
    whyEn: `The rest of this guide assumes you can open a shell over SSH. Beginners often stall before that step—each vendor differs (root password email vs keys-only, AWS security groups for port 22).
Example: a DigitalOcean droplet emails the IP and optional root password; on EC2 you pick a key pair at launch, then copy the SSH command from Instance Connect or your terminal.`,
    subsections: [
      {
        id: "0-1",
        number: "0.1",
        titleBn: "জেনেরিক VPS (DigitalOcean, Hetzner, Linode, Vultr…)",
        titleEn: "Generic VPS providers",
        purposeBn:
          "একই আইডিয়া: কন্ট্রোল প্যানেলে ইন্সট্যান্স → পাবলিক IPv4 → SSH পোর্ট ২২ খোলা।",
        purposeEn:
          "Same idea everywhere: dashboard → instance → public IPv4 → SSH on port 22 (unless you changed it).",
        nodes: [
          {
            type: "ol",
            items: [
              {
                bn: "প্রোভাইডার অ্যাকাউন্টে লগইন করে “Droplet / Server / Instance” তৈরি করুন (Ubuntu LTS বেছে নিন)।",
                en: "Log into the provider and create a Droplet/Server/Instance (pick an Ubuntu LTS image).",
              },
              {
                bn: "তালিকায় পাবলিক IPv4 নোট করুন। কিছু প্রোভাইডার প্রথম লগইনের রুট পাসওয়ার্ড ইমেইল করে; কেউ কেউ শুধু SSH কী।",
                en: "Copy the public IPv4 from the list. Some email a root password once; others are SSH-key-only.",
              },
              {
                bn: "নিজের মেশিনে টার্মিনাল খুলে `ssh root@আপনার_IP` বা প্রোভাইডারের দেওয়া কমান্ড চালান। ভুল IP বা ফায়ারওয়ালে ২২ বন্ধ থাকলে “Connection timed out” দেখতে পারেন।",
                en: "Open a terminal on your laptop and run `ssh root@YOUR_IP` or the command your provider documents. Wrong IP or blocked port 22 often shows “Connection timed out”.",
              },
            ],
          },
          {
            type: "code",
            lang: "bash",
            code: `# typical first login (password auth, if provider emailed root password)
ssh root@YOUR_SERVER_IP

# if you already added a deploy user + key on the server
ssh deploy@YOUR_SERVER_IP`,
          },
        ],
      },
      {
        id: "0-2",
        number: "0.2",
        titleBn: "AWS EC2",
        titleEn: "AWS EC2",
        purposeBn:
          "AWS তে সিকিউরিটি গ্রুপ, কী পেয়ার ও ইউজারনেম (ubuntu, ec2-user ইত্যাদি) আলাদা নিয়ম।",
        purposeEn:
          "EC2 adds security groups, key pairs, and image-specific default users (ubuntu, ec2-user, etc.).",
        nodes: [
          {
            type: "p",
            bn: "কনসোলে EC2 → Instances → Launch। AMI তে Ubuntu নিলে ডিফল্ট ইউজার সাধারণত ubuntu; Amazon Linux এ ec2-user।",
            en: "Console → EC2 → Instances → Launch. Ubuntu AMIs usually log in as ubuntu; Amazon Linux as ec2-user.",
          },
          {
            type: "p",
            bn: "লঞ্চের সময় বা পরে কী পেয়ার (.pem) ডাউনলোড করুন — AWS আবার দেখাবে না। ফাইল যে ফোল্ডারে আছে সেখানে টার্মিনাল খুলুন (বা `cd` দিয়ে সেই ডিরেক্টরিতে যান), তারপর `chmod 400` ও `ssh -i` চালান।",
            en: "Download the .pem at launch (AWS will not show it again). Open a terminal in the folder that contains the .pem (or `cd` there), then `chmod 400` and `ssh -i`.",
          },
          {
            type: "p",
            bn: "ইন্সট্যান্সের Security Group ইনবাউন্ডে TCP ২২ আপনার IP (বা অস্থায়ীভাবে 0.0.0.0/0 — কম সুপারিশ) খুলুন, নাহলে SSH যাবে না।",
            en: "Inbound rule TCP 22 on the instance security group must allow your IP (0.0.0.0/0 is possible but not recommended).",
          },
          {
            type: "p",
            bn: "হোস্ট হিসেবে কনসোলে দেখানো পাবলিক IPv4 অথবা AWS এর public DNS (`ec2-….compute.amazonaws.com` ধরনের) ব্যবহার করুন — নিজের ইন্সট্যান্সের মান বসাবেন। “Connect” ট্যাবে প্রায়ই উদাহরণ কমান্ড থাকে।",
            en: "Use your instance’s public IPv4 or its AWS public DNS (the `ec2-….compute.amazonaws.com` style hostname from the console). The “Connect” tab usually shows a template command—replace placeholders with your key path and host.",
          },
          {
            type: "code",
            lang: "bash",
            code: `cd ~/Downloads
# cd "C:\\Users\\You\\Downloads"

chmod 400 "./YOUR_KEY.pem"

# Ubuntu AMI — ubuntu@ (Amazon Linux — ec2-user@)
ssh -i "./YOUR_KEY.pem" ubuntu@YOUR_PUBLIC_DNS_OR_IP

# ssh -i "./YOUR_KEY.pem" ubuntu@ec2-00-00-00-00.us-east-1.compute.amazonaws.com
# ssh -i "./YOUR_KEY.pem" ubuntu@203.0.113.10`,
          },
          {
            type: "infobox",
            variant: "warning",
            titleBn: "পাথ ও কোটেশন",
            titleEn: "Paths & quotes",
            bodyBn:
              "স্পেস থাকা ফোল্ডারে থাকলে কীর পাথ কোটে রাখুন। `-i` এর পরে যে ফাইল দিচ্ছেন সেটাই প্রাইভেট কী — কখনো GitHub, চ্যাট বা স্ক্রিনশটে শেয়ার করবেন না।",
            bodyEn:
              "Quote the key path if folders have spaces. The file after `-i` is your private key—never paste it into GitHub, chat, or screenshots.",
          },
          {
            type: "infobox",
            variant: "manual",
            titleBn: "কনসোল থেকে “Connect”",
            titleEn: "Console “Connect” button",
            bodyBn:
              "ইন্সট্যান্স সিলেক্ট → Connect → EC2 Instance Connect দিয়ে ব্রাউজারে সেশন খুলতে পারেন (কী ছাড়াই), অথবা SSH ক্লায়েন্ট ট্যাবে কমান্ড কপি করুন।",
            bodyEn:
              "Select the instance → Connect → EC2 Instance Connect for a browser shell, or copy the SSH client example from the same page.",
          },
        ],
      },
    ],
  },
];
