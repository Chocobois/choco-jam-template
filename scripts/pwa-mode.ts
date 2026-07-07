import { PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { description, repo_name, title } from "./constants";

export default function pwaMode(mode: string): PluginOption {
  const isProdOrPreview = mode === "production";
  const basePath = isProdOrPreview ? `/${repo_name}/` : "/";
  return isProdOrPreview ? VitePWA({
    injectRegister: "auto",
    strategies: "injectManifest",
    srcDir: "/",
    filename: "sw.js",
    registerType: "autoUpdate",
    scope: basePath,
    includeManifestIcons: false,
    devOptions: {
      enabled: true,
    },
    injectManifest: {
      globPatterns: [
        "**/*.{js,css,html,webmanifest,png,mp3,opus,json,ttf}",
      ],
      globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
      rollupFormat: "iife",
    },
    manifest: {
      name: title,
      short_name: title,
      description,
      theme_color: "#2ecc71",
      background_color: "#000000",
      display: "standalone",
      start_url: basePath,

      icons: [
        {
          src: "icon.png",
          sizes: "144x144",
          type: "image/png",
        },
      ],
      screenshots: [
        {
          src: "og_image.png",
          sizes: "1200x630",
          type: "image/png",
          form_factor: "wide",
          label: "Gameplay on desktop",
        },
      ],
    },
    workbox: {
      globPatterns: [
        "**/*.{js,css,html,webmanifest,png,mp3,opus,json,ttf}",
      ],
      runtimeCaching: [
        {
          urlPattern: new RegExp(
            `${basePath}assets/.*\\.png$`,
            "i",
          ),
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 256,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: new RegExp(
            `${basePath}assets/.*\\.mp3|opus$`,
            "i",
          ),
          handler: "CacheFirst",
          options: {
            cacheName: "audio",
            expiration: {
              maxEntries: 128,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: new RegExp(`${basePath}assets/.*\\.json$`, "i"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "data",
            expiration: {
              maxEntries: 128,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
        {
          urlPattern: new RegExp(
            `${basePath}assets/.*\\.ttf$`,
            "i",
          ),
          handler: "CacheFirst",
          options: {
            cacheName: "fonts",
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
      ],
      navigateFallback: basePath + "index.html",
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
    },
  }) : undefined;
}
