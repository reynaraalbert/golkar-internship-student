import type { SiteContent } from "@/lib/data";

export const EMPTY_STATS = {
  totalMembers: 0,
  totalPimpinan: 0,
  mitraKerjaCount: 0,
  activeBills: 0,
  completedHearings: 0,
  aspirationsProcessed: 0,
};

export const EMPTY_SITECONTENT: SiteContent = {
  hero: {
    badge: "",
    title1: "",
    title2: "",
    subtitle: "",
    description: "",
    ctaPrimaryLabel: "",
    ctaPrimaryHref: "",
    ctaSecondaryLabel: "",
    ctaSecondaryHref: "",
    statuteQuote: "",
    statuteProgressLabel: "",
    statuteProgressValue: "",
  },
  statBar: { label1: "", label2: "", label3: "", label4: "" },
  mitraSection: { tagline: "", title: "", description: "" },
  kontak: {
    serviceTitle: "",
    serviceHours: "",
    email: "",
    mediaTitle: "",
    instagramHandle: "",
    youtubeLabel: "",
    twitterHandle: "",
    websiteLabel: "",
    aspirasiTitle: "",
    aspirasiDesc: "",
    aspirasiCta: "",
  },
  footer: {
    brandDescription: "",
    address: "",
    phone: "",
    email: "",
    transparencyText: "",
    ppidText: "",
    copyrightText: "",
  },
  maps: { embedUrl: "", openUrl: "", address: "", description: "" },
};