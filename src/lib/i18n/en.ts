export const en = {
  meta: {
    title: "Server Deploy Guide",
    description:
      "SSH from VPS or AWS, Linux hardening, Nginx, PM2 or Docker, CI/CD and backups — manual and Docker paths in Bengali and English.",
  },
  nav: {
    guide: "Guide",
    sections: "Sections",
    openMenu: "Open menu",
    closeMenu: "Close",
  },
  sidebar: {
    footerHint: "Progress and checkmarks update as you scroll.",
  },
  langSwitch: {
    bn: "বাংলা",
    en: "EN",
  },
  path: {
    label: "Deployment path",
    manual: "Manual Deploy",
    docker: "Docker Deploy",
    manualShort: "Manual Path",
    dockerShort: "Docker Path",
    activeHeading: "Currently active",
    activeManual: "Manual deploy — PM2 / native services on the host.",
    activeDocker: "Docker deploy — containers and Compose.",
    hint: "Click a tab to switch path; the guide and sidebar update below.",
  },
  sections: {
    purpose: "Why this matters & how to use it",
    subsectionWhy: "Why this step",
  },
  tier: {
    badgeRequired: "Required",
    badgeRecommended: "Recommended",
    badgeOptional: "Optional",
    panelTitle: "Section importance",
    bodyRequiredBn:
      "Skipping this section usually means you cannot complete access, runtime, or app connectivity—or you stay in a broken state. Doing it makes the stack work.",
    bodyRequiredEn:
      "Skipping this section usually means you cannot complete access, runtime, or app connectivity—or you stay in a broken state. Doing it makes the stack work.",
    bodyRecommendedBn:
      "You can often get a basic setup without it (e.g. root SSH, app on IP:port); with it you gain security, stability, and cleaner ops.",
    bodyRecommendedEn:
      "You can often get a basic setup without it (e.g. root SSH, app on IP:port); with it you gain security, stability, and cleaner ops.",
    bodyOptionalBn:
      "Useful for specific needs or advanced setups. The core stack can often run without it; turning it on gives that extra benefit.",
    bodyOptionalEn:
      "Useful for specific needs or advanced setups. The core stack can often run without it; turning it on gives that extra benefit.",
  },
  hero: {
    title: "Server Deploy Guide",
    subtitleEn: "Production-ready VPS deployment from zero to secure",
    ctaManual: "Manual Path",
    ctaDocker: "Docker Path",
  },
  copy: "Copy",
  copied: "Copied!",
  progress: "Reading progress",
  comparison: {
    topic: "Topic",
    manual: "Manual",
    docker: "Docker",
  },
  badges: {
    both: "BOTH",
    manual: "MANUAL",
    docker: "DOCKER",
  },
  infoTitles: {
    manualPath: "Manual path",
    dockerPath: "Docker path",
    skip: "Skip if not your path",
    warning: "Warning",
  },
  optionalSuffix: "(Optional)",
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    toggleAria: "Toggle light and dark mode",
  },
} as const;
