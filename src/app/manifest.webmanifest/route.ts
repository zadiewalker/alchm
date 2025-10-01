import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "ALCHM — Your Digital Sanctuary",
    short_name: "ALCHM",
    description: "A trauma-informed, AI-powered journaling sanctuary designed for healing, reflection, and personal growth.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    theme_color: "#a4b792",
    background_color: "#f7f7f2",
    lang: "en",
    dir: "ltr",
    categories: ["health", "lifestyle", "wellness", "productivity", "utilities"],
    icons: [
      {
        src: "/icons/icon-72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-96.png",
        sizes: "96x96", 
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "New Reflection",
        short_name: "Reflect",
        description: "Start a new reflection with Khepera",
        url: "/journal",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      },
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your healing progress",
        url: "/dashboard",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      },
      {
        name: "Crisis Support",
        short_name: "Crisis",
        description: "Immediate crisis support and resources",
        url: "/crisis",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      }
    ],
    prefer_related_applications: false,
    id: "alchm-sanctuary",
    related_applications: [],
    features: [
      "Cross-platform sync",
      "Offline reflection", 
      "Privacy-first encryption",
      "AI-guided insights",
      "Trauma-informed design",
      "Crisis support",
      "Healing pathways",
      "Growth tracking"
    ]
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}