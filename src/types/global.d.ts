import type en from "@/core/i18n/messages/en";

type Messages = typeof en;

declare global {
  /**
   * next-intl reads this to type translation keys. It must mirror the message
   * shape exactly — wrapping it in another property makes every key resolve to
   * `never`, which is what happened here before.
   *
   * The interface is deliberately empty: it exists only to inherit the shape.
   * (No eslint-disable here — this config does not load the typescript-eslint
   * plugin, so naming `no-empty-interface` is itself an error.)
   */
  interface IntlMessages extends Messages {}

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL?: string;
      HUBSPOT_KEY_DEFAULT?: string;
      SALESFORCE_TOKEN_CLIENT_A?: string;
      SALESFORCE_INSTANCE_CLIENT_A?: string;
      ZOHO_TOKEN_CLIENT_B?: string;
      ZOHO_API_DOMAIN_CLIENT_B?: string;
    }
  }
}

export {};
