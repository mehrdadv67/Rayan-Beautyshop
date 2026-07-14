import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {},
  bootstrap(app: StrapiApp) {
    // Force the Strapi admin panel into RTL (Persian) so the main navigation
    // sits on the right-hand side for the employer. This only changes the UI
    // direction; it does NOT alter the admin language, API IDs or content
    // types, so the frontend <-> backend connection keeps working as before.
    const forceRtl = () => {
      const el = document.documentElement;
      if (el.getAttribute("dir") !== "rtl") el.setAttribute("dir", "rtl");
      if (el.getAttribute("lang") !== "fa") el.setAttribute("lang", "fa");
    };

    forceRtl();

    // Strapi may re-apply a direction when the active locale changes,
    // so keep enforcing RTL whenever the attribute is mutated.
    const observer = new MutationObserver(forceRtl);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });

    const style = document.createElement("style");
    style.textContent = `
      /* Keep the main sidebar navigation pinned to the right in RTL mode */
      [data-strapi-layout="main"] {
        direction: rtl;
      }
      [data-strapi-layout="main"] > aside,
      [data-strapi-layout="main"] > nav {
        order: 2;
      }
    `;
    document.head.appendChild(style);
  },
};
