import type { StrapiApp } from "@strapi/strapi/admin";

const faTranslations = {
  "Auth.components.Oops.title": "اوه...",
  "Auth.components.Oops.text": "حساب کاربری شما تعلیق شده است.",
  "Auth.components.Oops.text.admin": "اگر این یک اشتباه است، لطفاً با مدیر سیستم خود تماس بگیرید.",
  "Auth.form.welcome.title": "داشبورد مدیریتی فروشگاه ARMO",
  "Auth.form.welcome.subtitle": "وارد قسمت مدیریتی شوید",
  "Auth.form.email.label": "ایمیل",
  "Auth.form.email.placeholder": "مثال: kai@doe.com",
  "Auth.form.error.blocked": "حساب کاربری شما توسط مدیر سیستم مسدود شده است.",
  "Auth.form.error.code.provide": "کد ارائه شده نادرست است.",
  "Auth.form.error.confirmed": "ایمیل حساب کاربری شما تایید نشده است.",
  "Auth.form.error.email.invalid": "این ایمیل نامعتبر است.",
  "Auth.form.error.email.provide": "لطفاً نام کاربری یا ایمیل خود را وارد کنید.",
  "Auth.form.error.email.taken": "این ایمیل قبلاً ثبت شده است.",
  "Auth.form.error.invalid": "نام کاربری یا رمز عبور نامعتبر است.",
  "Auth.form.error.params.provide": "پارامترهای ارائه شده نادرست هستند.",
  "Auth.form.error.password.format": "رمز عبور شما نمی‌تواند بیش از سه بار شامل علامت `$` باشد.",
  "Auth.form.error.password.local": "این کاربر هرگز رمز عبور محلی تنظیم نکرده است، لطفاً از طریق ارائه‌دهنده که در زمان ایجاد حساب استفاده شده وارد شوید.",
  "Auth.form.error.password.matching": "رمزهای عبور مطابقت ندارند.",
  "Auth.form.error.password.provide": "لطفاً رمز عبور خود را وارد کنید.",
  "Auth.form.error.ratelimit": "تعداد تلاش‌ها بیش از حد مجاز است، لطفاً چند دقیقه دیگر تلاش کنید.",
  "Auth.form.error.user.not-exist": "این ایمیل وجود ندارد.",
  "Auth.form.error.username.taken": "نام کاربری قبلاً گرفته شده است.",
  "Auth.form.rememberMe.label": "مرا به خاطر بسپار",
  "Auth.form.username.label": "نام کاربری",
  "Auth.form.username.placeholder": "مثال: Kai_Doe",
  "Auth.form.password.hide-password": "پنهان کردن رمز عبور",
  "Auth.form.password.hint": "حداقل ۸ کاراکتر، ۱ حرف بزرگ، ۱ حرف کوچک و ۱ عدد",
  "Auth.form.password.show-password": "نمایش رمز عبور",
  "Auth.link.forgot-password": "رمز عبور خود را فراموش کرده‌اید؟",
  "Auth.link.ready": "آماده ورود هستید؟",
  "Auth.link.signin": "ورود",
  "Auth.link.signin.account": "قبلاً حساب کاربری دارید؟",
  "Auth.login.sso.divider": "یا ورود با",
  "Auth.login.sso.loading": "در حال بارگذاری ارائه‌دهندگان...",
  "Auth.login.sso.subtitle": "ورود به حساب کاربری از طریق SSO",
  "Auth.reset-password.title": "بازیابی رمز عبور",
  "Auth.form.button.forgot-password": "ارسال ایمیل",
  "Auth.form.button.go-home": "بازگشت به صفحه اصلی",
  "Auth.form.button.login": "ورود",
  "Auth.form.button.login.providers.error": "نمی‌توانیم شما را از طریق ارائه‌دهنده انتخاب شده متصل کنیم.",
  "Auth.form.button.login.strapi": "ورود از طریق Strapi",
  "Auth.form.button.password-recovery": "بازیابی رمز عبور",
  "Auth.form.button.register": "بیایید شروع کنیم",
  "Auth.form.confirmPassword.label": "تایید رمز عبور",
  "Auth.form.currentPassword.label": "رمز عبور فعلی",
  "Auth.form.firstname.label": "نام",
  "Auth.form.firstname.placeholder": "مثال: Kai",
  "Auth.form.lastname.label": "نام خانوادگی",
  "Auth.form.lastname.placeholder": "مثال: Doe",
  "Auth.form.register.news.label": "دریافت اطلاعیه از ویژگی‌ها و بهبودهای جدید (با انجام این کار شما {terms} و {policy} را می‌پذیرید).",
  "Auth.form.register.subtitle": "اعتبارنامه‌ها فقط برای احراز هویت در Strapi استفاده می‌شوند. تمام داده‌های ذخیره شده در پایگاه داده شما نگهداری می‌شود.",
  "Auth.privacy-policy-agreement.policy": "حریم خصوصی",
  "Auth.privacy-policy-agreement.terms": "شرایط استفاده",
  "HomePage.head.title": "صفحه اصلی",
  "HomePage.header.title": "سلام {name}",
  "HomePage.header.subtitle": "به پنل مدیریت خود خوش آمدید",
  "Usecase.title": "کمی بیشتر درباره خودتان به ما بگویید",
  "Usecase.input.work-type": "چه نوع کاری انجام می‌دهید؟",
  "Usecase.button.skip": "پرش از این سوال",
  "Usecase.front-end": "توسعه‌دهنده فرانت‌اند",
  "Usecase.back-end": "توسعه‌دهنده بک‌اند",
  "Usecase.full-stack": "توسعه‌دهنده فول‌استک",
  "Usecase.content-manager": "مدیر محتوا",
  "Usecase.content-creator": "تولیدکننده محتوا",
  "Usecase.other": "سایر",
  "global.finish": "پایان",
  "global.submit": "ارسال",
  "global.password": "رمز عبور",
  "global.back": "بازگشت به صفحه قبلی",
  "global.save": "ذخیره",
  "global.home": "خانه",
  "global.content-manager": "مدیریت محتوا",
  "global.settings": "تنظیمات",
  "global.marketplace": "بازار افزونه ها",
  "global.plugins.content-manager": "مدیریت محتوا",
  "global.plugins.content-type-builder": "ساخت الگوی محتوا",
  "global.plugins.upload": "مخزن رسانه",
  "or": "یا",
  "Password": "رمز عبور",
  "Email": "ایمیل",
  "Username": "نام کاربری",
  "is": "کاربران",
  "app.components.LeftMenu.navbrand.title": "داشبورد مدیریتی",
  "components.Wysiwyg.ToggleMode.preview-mode": "پیش نمایش",
  "tours.contentManager.CreateNewEntry.title": "ثبت ورودی جدید",
  "tours.contentManager.Introduction.title": "مدیر محتوا",
  "tours.contentManager.Introduction.content": "تمام محتوا را اینجا در مدیریت محتوا بسازید و مدیریت کنید.",
  "tours.contentManager.Fields.content": "ابتدا فیلدهایی که در ساخت‌کننده الگوی محتوا ایجاد کردید را پر کنید.",
  "tours.contentTypeBuilder.Introduction.title": "ساخت‌کننده الگوی محتوا",
  "tours.contentTypeBuilder.Finish.content": "شما اولین نوع محتوای خود را ساختید! حالا به مدیریت محتوا بروید تا شروع به افزودن ورودی‌ها کنید!",
  "tours.overview.strapiCloud.label": "برنامه خود را در Strapi Cloud پیاده‌سازی کنید",
  "tours.apiTokens.FinalStep.title": "تبریک! زمان پیاده‌سازی برنامه شما است!",
  "tours.apiTokens.FinalStep.content": "شما همه چیز را برای پیاده‌سازی برنامه خود و به اشتراک گذاری محتوا با دنیا دارید.",
  "HomePage.widget.deploy-now.title": "آماده انتشار هستید؟",
  "HomePage.widget.deploy-now.description": "پیاده‌سازی با Strapi Cloud",
  "HomePage.widget.deploy-now.button": "پیاده‌سازی",
  "Content Manager": "مدیریت محتوا",
  "Media Library": "مخزن رسانه",
  "New entry": "ورودی جدید",
  "Content Type Builder": "ساخت‌کننده الگوی محتوا",
  "Files Upload": "آپلود فایل",
};

export default {
  config: {
    locales: ["fa"],
    auth: {
      logo: "/uploads/Minimalist_ARMO_Beauty_Logo_Favicon_copy_a5ac6f2c69.png",
    },
    translations: {
      fa: faTranslations,
    },
  },
  register(app: StrapiApp) {
    const originalRender = app.render.bind(app);
    app.render = function () {
      const originalGetItem = localStorage.getItem.bind(localStorage);
      localStorage.getItem = function (key: string) {
        if (key === "strapi-admin-language") {
          return "fa";
        }
        return originalGetItem(key);
      };
      const result = originalRender();
      localStorage.getItem = originalGetItem;

      try {
        const store = (app as any).store;
        if (store && store.getState) {
          const state = store.getState();
          console.log("[ARMO] Store locale:", state?.admin_app?.language?.locale);
        }
      } catch (e) {
        console.log("[ARMO] Could not read store:", e);
      }

      try {
        if (app.store && app.store.dispatch) {
          app.store.dispatch({ type: "admin/setLocale", payload: "fa" });
        }
      } catch (e) {
        console.log("[ARMO] dispatch failed:", e);
      }

      return result;
    };

    const originalLoadTrads = app.loadTrads.bind(app);
    app.loadTrads = async function (customTranslations) {
      console.log("[ARMO] loadTrads called with keys:", Object.keys(customTranslations || {}));
      await originalLoadTrads(customTranslations);
      console.log("[ARMO] loadTrads done, translations keys:", Object.keys(app.configurations.translations || {}));
      if (app.configurations.translations?.fa) {
        console.log("[ARMO] fa translations sample:", Object.keys(app.configurations.translations.fa).slice(0, 5));
      }
    };
  },
  async bootstrap(app: StrapiApp) {
    const forceRtl = () => {
      const el = document.documentElement;
      if (el.getAttribute("dir") !== "rtl") el.setAttribute("dir", "rtl");
      if (el.getAttribute("lang") !== "fa") el.setAttribute("lang", "fa");
    };

    forceRtl();

    const observer = new MutationObserver(forceRtl);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });

    const style = document.createElement("style");
    style.textContent = `
      [data-strapi-layout="main"] {
        direction: rtl;
      }
      [data-strapi-layout="main"] > aside,
      [data-strapi-layout="main"] > nav {
        order: 2;
      }
    `;
    document.head.appendChild(style);

    const originalSetTitle = document.title;
    const overrideTitle = () => {
      const current = document.title;
      if (current.endsWith(" | Strapi")) {
        document.title = current.replace(" | Strapi", " | داشبورد مدیریتی");
      }
    };
    overrideTitle();
    const titleObserver = new MutationObserver(overrideTitle);
    titleObserver.observe(document.querySelector("title"), { childList: true, characterData: true, subtree: true });
  },
};
