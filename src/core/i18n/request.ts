import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";
import { loadMessages } from "./messages";

/**
 * next-intl request config. Loads the message bundle for the active locale.
 * Referenced from next.config.mjs.
 */
export default getRequestConfig(async ({ locale }) => {
  const active = isLocale(locale) ? locale : defaultLocale;

  return {
    locale: active,
    messages: await loadMessages(active),
    timeZone: "Asia/Bangkok",
    formats: {
      dateTime: {
        short: { day: "numeric", month: "short", year: "numeric" },
      },
    },
    onError() {
      // Missing keys must not crash a page; they fall back to the key name.
    },
    getMessageFallback({ key }) {
      return key;
    },
  };
});
