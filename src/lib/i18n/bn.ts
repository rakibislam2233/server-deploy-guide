export const bn = {
  meta: {
    title: "সার্ভার ডেপ্লয় গাইড",
    description:
      "VPS ও AWS থেকে SSH, প্রাথমিক সেটআপ, Nginx, PM2/ডকার, CI/CD ও ব্যাকআপ — ম্যানুয়াল ও ডকার পথ, বাংলা ও ইংরেজি।",
  },
  nav: {
    guide: "গাইড",
    sections: "সেকশনসমূহ",
    openMenu: "মেনু খুলুন",
    closeMenu: "বন্ধ",
  },
  sidebar: {
    footerHint: "স্ক্রল করলে অগ্রগতি ও চেকমার্ক আপডেট হয়।",
  },
  langSwitch: {
    bn: "বাংলা",
    en: "EN",
  },
  path: {
    label: "ডেপ্লয়মেন্ট পথ",
    manual: "ম্যানুয়াল ডেপ্লয়",
    docker: "ডকার ডেপ্লয়",
    manualShort: "ম্যানুয়াল পথ",
    dockerShort: "ডকার পথ",
    activeHeading: "এখন সক্রিয়",
    activeManual: "ম্যানুয়াল ডেপ্লয় — হোস্টে PM2/সিস্টেম সার্ভিস।",
    activeDocker: "ডকার ডেপ্লয় — কন্টেইনার ও কম্পোজ।",
    hint: "ট্যাবে ক্লিক করে পথ বদলালে নিচের গাইড ও সাইডবার আপডেট হয়।",
  },
  sections: {
    purpose: "কেন দরকার ও কেন এভাবে",
    subsectionWhy: "কেন এই ধাপ",
  },
  tier: {
    badgeRequired: "প্রয়োজনীয়",
    badgeRecommended: "সুপারিশিত",
    badgeOptional: "ঐচ্ছিক",
    panelTitle: "এই সেকশনের গুরুত্ব",
    bodyRequiredBn:
      "না করলে সাধারণত সার্ভারে অ্যাপ চালু, প্রবেশ বা কানেকশন পুরোপুরি হয় না — বা গুরুতর ত্রুটি থেকে যায়। করলে স্ট্যাক কাজ করে।",
    bodyRequiredEn:
      "Skipping this section usually means you cannot complete access, runtime, or app connectivity—or you stay in a broken state. Doing it makes the stack work.",
    bodyRecommendedBn:
      "না করলেও অনেক সময় মৌলিক কাজ চলতে পারে (যেমন রুট দিয়ে SSH, IP:পোর্টে অ্যাপ); করলে নিরাপত্তা, স্থায়িত্ব ও দলের কাজের ধরন ভালো হয়।",
    bodyRecommendedEn:
      "You can often get a basic setup without it (e.g. root SSH, app on IP:port); with it you gain security, stability, and cleaner ops.",
    bodyOptionalBn:
      "নির্দিষ্ট দরকারে লাগে বা অ্যাডভান্স সেটআপ। না করলে মূল স্ট্যাক অনেক সময় চলতে পারে; করলে সেই বিষয়ে লাভ বা সুবিধা।",
    bodyOptionalEn:
      "Useful for specific needs or advanced setups. The core stack can often run without it; turning it on gives that extra benefit.",
  },
  hero: {
    title: "সার্ভার ডেপ্লয় গাইড",
    subtitleEn: "প্রোডাকশন-রেডি ভিপিএস ডেপ্লয়মেন্ট — শূন্য থেকে নিরাপদ পর্যন্ত",
    ctaManual: "ম্যানুয়াল পথ",
    ctaDocker: "ডকার পথ",
  },
  copy: "কপি",
  copied: "কপি হয়েছে!",
  progress: "পড়ার অগ্রগতি",
  comparison: {
    topic: "বিষয়",
    manual: "ম্যানুয়াল",
    docker: "ডকার",
  },
  badges: {
    both: "উভয়",
    manual: "ম্যানুয়াল",
    docker: "ডকার",
  },
  infoTitles: {
    manualPath: "ম্যানুয়াল পথ",
    dockerPath: "ডকার পথ",
    skip: "আপনার পথ না হলে এড়িয়ে যান",
    warning: "সতর্কতা",
  },
  optionalSuffix: "(ঐচ্ছিক)",
  theme: {
    label: "থিম",
    light: "লাইট",
    dark: "ডার্ক",
    toggleAria: "লাইট ও ডার্ক মোড বদলান",
  },
} as const;
