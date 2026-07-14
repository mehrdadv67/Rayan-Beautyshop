import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'da',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app: StrapiApp) {
    // Inject CSS to move the main navigation menu from left to right
    const style = document.createElement("style");
    style.textContent = `
      /* Move the main sidebar navigation from left to right */
      [data-strapi-layout="main"] {
        flex-direction: row-reverse !important;
      }
      
      /* Ensure the main content stays properly positioned */
      [data-strapi-layout="main"] > main,
      [data-strapi-layout="main"] > div:last-child {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      
      /* Fix any left-to-right specific styles for RTL support */
      [direction="ltr"] {
        direction: ltr;
      }
      
      /* Adjust the main nav wrapper */
      nav[aria-label="Main"],
      nav[role="navigation"],
      header + nav,
      aside {
        order: 1 !important;
      }
      
      /* Content area should come first visually */
      [data-strapi-layout="main"] > *:not(nav):not(aside):not([role="navigation"]) {
        order: 0 !important;
      }
    `;
    document.head.appendChild(style);
  },
};
