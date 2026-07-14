import { ILFlag } from "@components/icons/ILFlag";
import { SAFlag } from "@components/icons/SAFlag";
import { CNFlag } from "@components/icons/CNFlag";
import { USFlag } from "@components/icons/USFlag";
import { DEFlag } from "@components/icons/DEFlag";
import { ESFlag } from "@components/icons/ESFlag";

import { ThunderIcon } from "@components/icons/thunder-icon";
import { WomenIcon } from "@components/icons/women-icon";
import { MenIcon } from "@components/icons/men-icon";
import { WatchIcon } from "@components/icons/watch-icon";
import { WalletIcon } from "@components/icons/wallet-icon";
import { BagIcon } from "@components/icons/bag-icon";
import { JewelryIcon } from "@components/icons/jewelry-icon";
import { SunglassIcon } from "@components/icons/sunglass-icon";
import { SneakerIcon } from "@components/icons/sneaker-icon";

export const siteSettings = {
  name: "Rayan",
  description: "فروشگاه آنلاین رایان لوازم آرایشی و بهداشتی",
  author: {
    name: "Mehrdad & Khashayar",
    websiteUrl: "https://www.mountgram.com",
    address: "",
  },
  logo: {
    url: "/assets/images/logo.svg",
    alt: "Rayan",
    href: "/",
    width: 95,
    height: 30,
  },
  defaultLanguage: "fa",
  currencyCode: "IRR",
  site_header: {
    menu: [
      {
        id: 1,
        path: "/search?q=لوازم-آرایشی",
        label: "لوازم آرایشی",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=آرایش-صورت",
                label: "آرایش صورت",
                columnItemItems: [
                  { id: 1, path: "/search?q=کرم-پودر", label: "کرم پودر" },
                  { id: 2, path: "/search?q=پنکیک", label: "پنکیک" },
                  { id: 3, path: "/search?q=رژ-گونه", label: "رژ گونه" },
                  { id: 4, path: "/search?q=کانسیلر", label: "کانسیلر" },
                  { id: 5, path: "/search?q=پودر-برنزه", label: "پودر برنزه" },
                  {
                    id: 6,
                    path: "/search?q=فیکساتور-آرایش",
                    label: "فیکساتور آرایش",
                  },
                  {
                    id: 7,
                    path: "/search?q=پرایمر-صورت",
                    label: "پرایمر صورت",
                  },
                  {
                    id: 8,
                    path: "/search?q=BB-CC-DD-کرم",
                    label: "BB و CC و DD کرم",
                  },
                  { id: 9, path: "/search?q=هایلایتر", label: "هایلایتر" },
                  { id: 10, path: "/search?q=پن-استیک", label: "پن استیک" },
                  { id: 11, path: "/search?q=کانتور", label: "کانتور" },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=آرایش-چشم-و-ابرو",
                label: "آرایش چشم و ابرو",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=پرایمر-سایه-چشم",
                    label: "پرایمر سایه چشم",
                  },
                  { id: 2, path: "/search?q=ژل-ابرو", label: "ژل ابرو" },
                  { id: 3, path: "/search?q=ماژیک-ابرو", label: "ماژیک ابرو" },
                  { id: 4, path: "/search?q=صابون-ابرو", label: "صابون ابرو" },
                  { id: 5, path: "/search?q=ریمل", label: "ریمل" },
                  { id: 6, path: "/search?q=خط-چشم", label: "خط چشم" },
                  { id: 7, path: "/search?q=مداد-چشم", label: "مداد چشم" },
                  { id: 8, path: "/search?q=سایه-چشم", label: "سایه چشم" },
                  { id: 9, path: "/search?q=ریمل-ابرو", label: "ریمل ابرو" },
                  {
                    id: 10,
                    path: "/search?q=مداد-و-سایه-ابرو",
                    label: "مداد و سایه ابرو",
                  },
                  {
                    id: 11,
                    path: "/search?q=تقویت-کننده-مژه-و-ابرو",
                    label: "تقویت کننده مژه و ابرو",
                  },
                  { id: 12, path: "/search?q=پرایمر-چشم", label: "پرایمر چشم" },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=آرایش-لب",
                label: "آرایش لب",
                columnItemItems: [
                  { id: 1, path: "/search?q=تینت-لب", label: "تینت لب" },
                  { id: 2, path: "/search?q=پرایمر-لب", label: "پرایمر لب" },
                  { id: 3, path: "/search?q=رژ-لب-جامد", label: "رژ لب جامد" },
                  { id: 4, path: "/search?q=رژ-لب-مایع", label: "رژ لب مایع" },
                  { id: 5, path: "/search?q=بالم-لب", label: "بالم لب" },
                  { id: 6, path: "/search?q=مداد-لب", label: "مداد لب" },
                ],
              },
              {
                id: 2,
                path: "/search?q=آرایش-ناخن",
                label: "آرایش ناخن",
                columnItemItems: [
                  { id: 1, path: "/search?q=لاک-ناخن", label: "لاک ناخن" },
                  { id: 2, path: "/search?q=لاک-پاک-کن", label: "لاک پاک کن" },
                  { id: 3, path: "/search?q=لاک-خشک-کن", label: "لاک خشک کن" },
                  { id: 4, path: "/search?q=تاپ-کات", label: "تاپ کات" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        path: "/search?q=محصولات-پوست",
        label: "محصولات پوست",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بر-اساس-نوع-محصول",
                label: "بر اساس نوع محصول",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=ضد-آفتاب-صورت",
                    label: "ضد آفتاب صورت",
                  },
                  { id: 2, path: "/search?q=کرم-روز", label: "کرم روز" },
                  { id: 3, path: "/search?q=کرم-شب", label: "کرم شب" },
                  { id: 4, path: "/search?q=دور-چشم", label: "دور چشم" },
                  { id: 5, path: "/search?q=ماسک-صورت", label: "ماسک صورت" },
                  { id: 6, path: "/search?q=سرم", label: "سرم" },
                  { id: 7, path: "/search?q=اسپری-آب", label: "اسپری آب" },
                  { id: 8, path: "/search?q=اتو-برنز", label: "اتو برنز" },
                  {
                    id: 9,
                    path: "/search?q=اسکراب-و-لایه-بردار",
                    label: "اسکراب و لایه بردار",
                  },
                  {
                    id: 10,
                    path: "/search?q=کرم-گردن-و-دکلته",
                    label: "کرم گردن و دکلته",
                  },
                  {
                    id: 11,
                    path: "/search?q=آنتی-اکسیدان",
                    label: "آنتی اکسیدان",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بر-اساس-نیاز-پوست",
                label: "بر اساس نیاز پوست",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=تنظیم-کننده-چربی-پوست",
                    label: "تنظیم کننده چربی پوست",
                  },
                  { id: 2, path: "/search?q=مات-کننده", label: "مات کننده" },
                  {
                    id: 3,
                    path: "/search?q=مرطوب-کننده-و-آبرسان",
                    label: "مرطوب کننده و آبرسان",
                  },
                  { id: 4, path: "/search?q=ضد-چروک", label: "ضد چروک" },
                  {
                    id: 5,
                    path: "/search?q=ضد-پف-و-سیاهی-دور-چشم",
                    label: "ضد پف و سیاهی دور چشم",
                  },
                  {
                    id: 6,
                    path: "/search?q=لیفتینگ-و-ضد-افتادگی",
                    label: "لیفتینگ و ضد افتادگی",
                  },
                  { id: 7, path: "/search?q=ضد-لک", label: "ضد لک" },
                  { id: 8, path: "/search?q=ضد-جوش", label: "ضد جوش" },
                  { id: 9, path: "/search?q=شفاف-کننده", label: "شفاف کننده" },
                  { id: 10, path: "/search?q=روشن-کننده", label: "روشن کننده" },
                  {
                    id: 11,
                    path: "/search?q=ترمیم-کننده",
                    label: "ترمیم کننده",
                  },
                  {
                    id: 12,
                    path: "/search?q=ضد-التهاب-و-ضد-خارش",
                    label: "ضد التهاب و ضد خارش",
                  },
                  { id: 13, path: "/search?q=ضد-قرمزی", label: "ضد قرمزی" },
                  {
                    id: 14,
                    path: "/search?q=ضد-ترک-اِسکار",
                    label: "ضد ترک اِسکار",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بر-اساس-نوع-پوست",
                label: "بر اساس نوع پوست",
                columnItemItems: [
                  { id: 1, path: "/search?q=پوست-خشک", label: "پوست خشک" },
                  {
                    id: 2,
                    path: "/search?q=پوست-چرب-و-مختلط",
                    label: "پوست چرب و مختلط",
                  },
                  { id: 3, path: "/search?q=پوست-نرمال", label: "پوست نرمال" },
                  { id: 4, path: "/search?q=پوست-حساس", label: "پوست حساس" },
                ],
              },
              {
                id: 2,
                path: "/search?q=بر-اساس-سن-پوستی",
                label: "بر اساس سن پوستی",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=20-تا-30-سال",
                    label: "20 تا 30 سال",
                  },
                  {
                    id: 2,
                    path: "/search?q=30-تا-40-سال",
                    label: "30 تا 40 سال",
                  },
                  {
                    id: 3,
                    path: "/search?q=40-تا-50-سال",
                    label: "40 تا 50 سال",
                  },
                  {
                    id: 4,
                    path: "/search?q=50-سال-به-بالا",
                    label: "50 سال به بالا",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 3,
        path: "/search?q=محصولات-مو",
        label: "محصولات مو",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=مراقبت-مو",
                label: "مراقبت مو",
                columnItemItems: [
                  { id: 1, path: "/search?q=شیرمو", label: "شیرمو" },
                  { id: 2, path: "/search?q=شامپو-مو", label: "شامپو مو" },
                  {
                    id: 3,
                    path: "/search?q=نرم-کننده-مو",
                    label: "نرم کننده مو",
                  },
                  { id: 4, path: "/search?q=ماسک-مو", label: "ماسک مو" },
                  { id: 5, path: "/search?q=کرم-مو", label: "کرم مو" },
                  { id: 6, path: "/search?q=سرم-مو", label: "سرم مو" },
                  { id: 7, path: "/search?q=روغن-مو", label: "روغن مو" },
                  {
                    id: 8,
                    path: "/search?q=اسپری-2-فاز",
                    label: "اسپری 2 فاز",
                  },
                  { id: 9, path: "/search?q=لوسیون-مو", label: "لوسیون مو" },
                  { id: 10, path: "/search?q=شامپو-خشک", label: "شامپو خشک" },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=رنگ-مو",
                label: "رنگ مو",
                columnItemItems: [
                  { id: 1, path: "/search?q=رنگ-ابرو", label: "رنگ ابرو" },
                  {
                    id: 2,
                    path: "/search?q=ریموور-رنگ-مو",
                    label: "ریموور رنگ مو",
                  },
                  {
                    id: 3,
                    path: "/search?q=رژ-و-استیک-مو",
                    label: "رژ و استیک مو",
                  },
                  {
                    id: 4,
                    path: "/search?q=ماسک-موی-رنگی",
                    label: "ماسک موی رنگی",
                  },
                  { id: 5, path: "/search?q=کیت-رنگ-مو", label: "کیت رنگ مو" },
                  {
                    id: 6,
                    path: "/search?q=رنگ-موی-تیوپی",
                    label: "رنگ موی تیوپی",
                  },
                  { id: 7, path: "/search?q=اکسیدان", label: "اکسیدان" },
                  {
                    id: 8,
                    path: "/search?q=شامپو-رنگ",
                    label: "شامپو رنگ (رنگساژ)",
                  },
                  { id: 9, path: "/search?q=دکلره", label: "دکلره" },
                  { id: 10, path: "/search?q=واریاسیون", label: "واریاسیون" },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بر-اساس-نوع-مو",
                label: "بر اساس نوع مو",
                columnItemItems: [
                  { id: 1, path: "/search?q=موی-خشک", label: "موی خشک" },
                  { id: 2, path: "/search?q=موی-چرب", label: "موی چرب" },
                  { id: 3, path: "/search?q=موی-نرمال", label: "موی نرمال" },
                  {
                    id: 4,
                    path: "/search?q=موی-آسیب-دیده",
                    label: "موی آسیب دیده",
                  },
                  { id: 5, path: "/search?q=موی-صاف", label: "موی صاف" },
                  { id: 6, path: "/search?q=موی-وز", label: "موی وز" },
                  {
                    id: 7,
                    path: "/search?q=موی-فر-و-مجعد",
                    label: "موی فر و مجعد",
                  },
                  {
                    id: 8,
                    path: "/search?q=موی-بلوند-هایلایت-و-مش",
                    label: "موی بلوند، هایلایت و مش",
                  },
                  {
                    id: 9,
                    path: "/search?q=موی-رنگ-شده",
                    label: "موی رنگ شده",
                  },
                  {
                    id: 10,
                    path: "/search?q=نازک-و-کم-حجم",
                    label: "نازک و کم حجم",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        path: "/search?q=محصولات-حمام-و-بدن",
        label: "محصولات حمام و بدن",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=شوینده-بدن",
                label: "شوینده بدن",
                columnItemItems: [
                  { id: 1, path: "/search?q=موس-بدن", label: "موس بدن" },
                  { id: 2, path: "/search?q=فوم-بدن", label: "فوم بدن" },
                  { id: 3, path: "/search?q=روغن-حمام", label: "روغن حمام" },
                  { id: 4, path: "/search?q=اسکراب-بدن", label: "اسکراب بدن" },
                  { id: 5, path: "/search?q=شامپو-بدن", label: "شامپو بدن" },
                  {
                    id: 6,
                    path: "/search?q=پن-صورت-و-بدن",
                    label: "پن (صابون) صورت و بدن",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=مراقبت-بدن",
                label: "مراقبت بدن",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=روشن-کننده-بدن",
                    label: "روشن کننده بدن",
                  },
                  { id: 2, path: "/search?q=ضد-لک-بدن", label: "ضد لک بدن" },
                  {
                    id: 3,
                    path: "/search?q=ترمیم-کننده-شقاق-سینه",
                    label: "ترمیم کننده شقاق سینه",
                  },
                  {
                    id: 4,
                    path: "/search?q=فرم-دهنده-سینه-و-باسن",
                    label: "فرم دهنده سینه و باسن",
                  },
                  {
                    id: 5,
                    path: "/search?q=ضد-آفتاب-بدن",
                    label: "ضد آفتاب بدن",
                  },
                  {
                    id: 6,
                    path: "/search?q=اتو-برنز",
                    label: "اتو برنز (بدون آفتاب)",
                  },
                  {
                    id: 7,
                    path: "/search?q=برنزه-کننده",
                    label: "برنزه کننده (با آفتاب)",
                  },
                  {
                    id: 8,
                    path: "/search?q=افترسان",
                    label: "افترسان (مراقبت بعد از آفتاب)",
                  },
                  { id: 9, path: "/search?q=ضد-جوش-بدن", label: "ضد جوش بدن" },
                  { id: 10, path: "/search?q=ضد-سلولیت", label: "ضد سلولیت" },
                  {
                    id: 11,
                    path: "/search?q=ضد-ترک-و-استرچ-مارک",
                    label: "ضد ترک و استرچ مارک",
                  },
                  { id: 12, path: "/search?q=سفت-کننده", label: "سفت کننده" },
                  {
                    id: 13,
                    path: "/search?q=ضد-درد-سوختگی-و-التهاب",
                    label: "ضد درد، سوختگی و التهاب",
                  },
                  { id: 14, path: "/search?q=کرم-لاغری", label: "کرم لاغری" },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=مرطوب-کننده-و-آبرسان-بدن",
                label: "مرطوب کننده و آبرسان بدن",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=شیر-و-لوسیون-بدن",
                    label: "شیر و لوسیون بدن",
                  },
                  { id: 2, path: "/search?q=کره-بدن", label: "کره بدن" },
                  { id: 3, path: "/search?q=روغن-بدن", label: "روغن بدن" },
                  { id: 4, path: "/search?q=کرم-بدن", label: "کرم بدن" },
                  { id: 5, path: "/search?q=بالم-بدن", label: "بالم بدن" },
                ],
              },
              {
                id: 2,
                path: "/search?q=مراقبت-دست-و-پا",
                label: "مراقبت دست و پا",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=مایع-دستشویی",
                    label: "مایع دستشویی",
                  },
                  {
                    id: 2,
                    path: "/search?q=مرطوب-کننده-پا",
                    label: "مرطوب کننده پا",
                  },
                  {
                    id: 3,
                    path: "/search?q=مرطوب-کننده-دست",
                    label: "مرطوب کننده دست",
                  },
                  {
                    id: 4,
                    path: "/search?q=ترمیم-کننده-دست",
                    label: "ترمیم کننده دست",
                  },
                  {
                    id: 5,
                    path: "/search?q=روشن-کننده-و-ضد-لک-پشت-دست",
                    label: "روشن کننده و ضد لک پشت دست",
                  },
                  {
                    id: 6,
                    path: "/search?q=ضد-چروک-دست",
                    label: "ضد چروک دست",
                  },
                  {
                    id: 7,
                    path: "/search?q=ضد-ترک-پاشنه",
                    label: "ضد ترک پاشنه",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 5,
        path: "/search?q=محصولات-بهداشتی",
        label: "محصولات بهداشتی",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بهداشت-و-مراقبت-بدن",
                label: "بهداشت و مراقبت بدن",
                columnItemItems: [
                  { id: 1, path: "/search?q=گوش-پاک-کن", label: "گوش پاک کن" },
                ],
              },
              {
                id: 2,
                path: "/search?q=محصولات-دئودورانت-ضد-تعریق",
                label: "محصولات دئودورانت ضد تعریق",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=اسپری-ضد-تعریق",
                    label: "اسپری ضد تعریق",
                  },
                  {
                    id: 2,
                    path: "/search?q=استیک-ضد-تعریق",
                    label: "استیک ضد تعریق",
                  },
                  {
                    id: 3,
                    path: "/search?q=کرم-ضد-تعریق",
                    label: "کرم ضد تعریق",
                  },
                  {
                    id: 4,
                    path: "/search?q=مام-ضد-تعریق",
                    label: "مام ضد تعریق",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بهداشت-دهان-و-دندان",
                label: "بهداشت دهان و دندان",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=زبان-پاک-کن",
                    label: "زبان پاک کن",
                  },
                  { id: 2, path: "/search?q=مسواک", label: "مسواک" },
                  { id: 3, path: "/search?q=دهانشویه", label: "دهانشویه" },
                  { id: 4, path: "/search?q=نخ-دندان", label: "نخ دندان" },
                  { id: 5, path: "/search?q=خمیر-دندان", label: "خمیر دندان" },
                  { id: 6, path: "/search?q=مسواک-برقی", label: "مسواک برقی" },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بهداشت-بانوان",
                label: "بهداشت بانوان",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=پد-بهداشتی-بانوان",
                    label: "پد بهداشتی بانوان",
                  },
                  {
                    id: 2,
                    path: "/search?q=ژل-بهداشتی-بانوان",
                    label: "ژل بهداشتی بانوان",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=بهداشت-آقایان",
                label: "بهداشت آقایان",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=لوازم-جانبی-اصلاح",
                    label: "لوازم جانبی اصلاح",
                  },
                  {
                    id: 2,
                    path: "/search?q=تیغ-اصلاح-مردانه",
                    label: "تیغ اصلاح مردانه",
                  },
                  {
                    id: 3,
                    path: "/search?q=قبل-از-اصلاح",
                    label: "قبل از اصلاح",
                  },
                  {
                    id: 4,
                    path: "/search?q=بعد-از-اصلاح",
                    label: "بعد از اصلاح",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 6,
        path: "/search?q=لوازم-برقی-شخصی",
        label: "لوازم برقی شخصی",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=سشوار-و-خشک-کن-مو",
                label: "سشوار و خشک کن مو",
                columnItemItems: [
                  { id: 1, path: "/search?q=سشوار", label: "سشوار" },
                  {
                    id: 2,
                    path: "/search?q=سشوار-چرخشی",
                    label: "سشوار چرخشی",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=حالت-دهنده-برقی-مو",
                label: "حالت دهنده برقی مو",
                columnItemItems: [
                  { id: 1, path: "/search?q=اتو-مو", label: "اتو مو" },
                  {
                    id: 2,
                    path: "/search?q=برس-صاف-کننده-مو",
                    label: "برس صاف کننده مو",
                  },
                  {
                    id: 3,
                    path: "/search?q=برس-حالت-دهنده-مو",
                    label: "برس حالت دهنده مو",
                  },
                  {
                    id: 4,
                    path: "/search?q=بیگودی-برقی",
                    label: "بیگودی برقی",
                  },
                  {
                    id: 5,
                    path: "/search?q=فر-کننده-مو",
                    label: "فر کننده مو",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=اصلاح-موی-سر-و-صورت",
                label: "اصلاح موی سر و صورت",
                columnItemItems: [
                  { id: 1, path: "/search?q=ریش-تراش", label: "ریش تراش" },
                  {
                    id: 2,
                    path: "/search?q=ماشین-اصلاح-سر-و-صورت",
                    label: "ماشین اصلاح سر و صورت",
                  },
                  {
                    id: 3,
                    path: "/search?q=ماشین-اصلاح-گوش-بینی-و-ابرو",
                    label: "ماشین اصلاح گوش، بینی و ابرو",
                  },
                ],
              },
              {
                id: 2,
                path: "/search?q=اصلاح-موی-صورت-و-بدن",
                label: "اصلاح موی صورت و بدن",
                columnItemItems: [
                  {
                    id: 1,
                    path: "/search?q=لوازم-جانبی-ماشین-اصلاح",
                    label: "لوازم جانبی ماشین اصلاح",
                  },
                  { id: 2, path: "/search?q=اپیلاتور", label: "اپیلاتور" },
                  { id: 3, path: "/search?q=لیزر-بدن", label: "لیزر بدن" },
                  {
                    id: 4,
                    path: "/search?q=ماشین-اصلاح-بدن-بانوان",
                    label: "ماشین اصلاح بدن بانوان",
                  },
                  {
                    id: 5,
                    path: "/search?q=ماشین-اصلاح-بدن-آقایان",
                    label: "ماشین اصلاح بدن آقایان",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=سایر-محصولات",
                label: "سایر محصولات",
                columnItemItems: [
                  { id: 1, path: "/search?q=فیس-براش", label: "فیس براش" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 7,
        path: "/search?q=عطر",
        label: "عطر",
        columns: [
          {
            id: 1,
            columnItems: [
              {
                id: 1,
                path: "/search?q=عطر-و-ادکلن-مردانه",
                label: "عطر و ادکلن مردانه",
                columnItemItems: [],
              },
              {
                id: 2,
                path: "/search?q=عطر-و-ادکلن-زنانه",
                label: "عطر و ادکلن زنانه",
                columnItemItems: [],
              },
              {
                id: 3,
                path: "/search?q=مشترک-مردانه-و-زنانه",
                label: "مشترک مردانه و زنانه",
                columnItemItems: [],
              },
            ],
          },
          {
            id: 2,
            columnItems: [
              {
                id: 1,
                path: "/search?q=ادکلن-کودک",
                label: "ادکلن کودک",
                columnItemItems: [],
              },
              {
                id: 2,
                path: "/search?q=عطر-جیبی",
                label: "عطر جیبی (مینی سایز)",
                columnItemItems: [],
              },
              {
                id: 3,
                path: "/search?q=اسپری-خوش-بو-کننده-بدن",
                label: "اسپری خوش بو کننده بدن",
                columnItemItems: [],
              },
            ],
          },
          {
            id: 3,
            columnItems: [
              {
                id: 1,
                path: "/search?q=بادی-اسپلش",
                label: "بادی اسپلش",
                columnItemItems: [],
              },
              {
                id: 2,
                path: "/search?q=اسپری-خوش-بو-کننده-هوا",
                label: "اسپری خوش بو کننده هوا",
                columnItemItems: [],
              },
              {
                id: 3,
                path: "/search?q=اسپری-خوش-بو-کننده-کفش",
                label: "اسپری خوش بو کننده کفش",
                columnItemItems: [],
              },
            ],
          },
        ],
      },
      {
        id: 8,
        path: "/search",
        label: "جستجو",
      },
    ],
    mobileMenu: [
      {
        id: 1,
        path: "/search?q=لوازم-آرایشی",
        label: "لوازم آرایشی",
        subMenu: [
          {
            id: 1,
            path: "/search?q=آرایش-صورت",
            label: "آرایش صورت",
            subMenu: [
              { id: 1, path: "/search?q=کرم-پودر", label: "کرم پودر" },
              { id: 2, path: "/search?q=پنکیک", label: "پنکیک" },
              { id: 3, path: "/search?q=رژ-گونه", label: "رژ گونه" },
              { id: 4, path: "/search?q=کانسیلر", label: "کانسیلر" },
              { id: 5, path: "/search?q=پودر-برنزه", label: "پودر برنزه" },
              {
                id: 6,
                path: "/search?q=فیکساتور-آرایش",
                label: "فیکساتور آرایش",
              },
              { id: 7, path: "/search?q=پرایمر-صورت", label: "پرایمر صورت" },
              {
                id: 8,
                path: "/search?q=BB-CC-DD-کرم",
                label: "BB و CC و DD کرم",
              },
              { id: 9, path: "/search?q=هایلایتر", label: "هایلایتر" },
              { id: 10, path: "/search?q=پن-استیک", label: "پن استیک" },
              { id: 11, path: "/search?q=کانتور", label: "کانتور" },
            ],
          },
          {
            id: 2,
            path: "/search?q=آرایش-چشم-و-ابرو",
            label: "آرایش چشم و ابرو",
            subMenu: [
              {
                id: 1,
                path: "/search?q=پرایمر-سایه-چشم",
                label: "پرایمر سایه چشم",
              },
              { id: 2, path: "/search?q=ژل-ابرو", label: "ژل ابرو" },
              { id: 3, path: "/search?q=ماژیک-ابرو", label: "ماژیک ابرو" },
              { id: 4, path: "/search?q=صابون-ابرو", label: "صابون ابرو" },
              { id: 5, path: "/search?q=ریمل", label: "ریمل" },
              { id: 6, path: "/search?q=خط-چشم", label: "خط چشم" },
              { id: 7, path: "/search?q=مداد-چشم", label: "مداد چشم" },
              { id: 8, path: "/search?q=سایه-چشم", label: "سایه چشم" },
              { id: 9, path: "/search?q=ریمل-ابرو", label: "ریمل ابرو" },
              {
                id: 10,
                path: "/search?q=مداد-و-سایه-ابرو",
                label: "مداد و سایه ابرو",
              },
              {
                id: 11,
                path: "/search?q=تقویت-کننده-مژه-و-ابرو",
                label: "تقویت کننده مژه و ابرو",
              },
              { id: 12, path: "/search?q=پرایمر-چشم", label: "پرایمر چشم" },
            ],
          },
          {
            id: 3,
            path: "/search?q=آرایش-لب",
            label: "آرایش لب",
            subMenu: [
              { id: 1, path: "/search?q=تینت-لب", label: "تینت لب" },
              { id: 2, path: "/search?q=پرایمر-لب", label: "پرایمر لب" },
              { id: 3, path: "/search?q=رژ-لب-جامد", label: "رژ لب جامد" },
              { id: 4, path: "/search?q=رژ-لب-مایع", label: "رژ لب مایع" },
              { id: 5, path: "/search?q=بالم-لب", label: "بالم لب" },
              { id: 6, path: "/search?q=مداد-لب", label: "مداد لب" },
            ],
          },
          {
            id: 4,
            path: "/search?q=آرایش-ناخن",
            label: "آرایش ناخن",
            subMenu: [
              { id: 1, path: "/search?q=لاک-ناخن", label: "لاک ناخن" },
              { id: 2, path: "/search?q=لاک-پاک-کن", label: "لاک پاک کن" },
              { id: 3, path: "/search?q=لاک-خشک-کن", label: "لاک خشک کن" },
              { id: 4, path: "/search?q=تاپ-کات", label: "تاپ کات" },
            ],
          },
        ],
      },
      {
        id: 2,
        path: "/search?q=محصولات-پوست",
        label: "محصولات پوست",
        subMenu: [
          {
            id: 1,
            path: "/search?q=بر-اساس-نوع-محصول",
            label: "بر اساس نوع محصول",
            subMenu: [
              {
                id: 1,
                path: "/search?q=ضد-آفتاب-صورت",
                label: "ضد آفتاب صورت",
              },
              { id: 2, path: "/search?q=کرم-روز", label: "کرم روز" },
              { id: 3, path: "/search?q=کرم-شب", label: "کرم شب" },
              { id: 4, path: "/search?q=دور-چشم", label: "دور چشم" },
              { id: 5, path: "/search?q=ماسک-صورت", label: "ماسک صورت" },
              { id: 6, path: "/search?q=سرم", label: "سرم" },
              { id: 7, path: "/search?q=اسپری-آب", label: "اسپری آب" },
              { id: 8, path: "/search?q=اتو-برنز", label: "اتو برنز" },
              {
                id: 9,
                path: "/search?q=اسکراب-و-لایه-بردار",
                label: "اسکراب و لایه بردار",
              },
              {
                id: 10,
                path: "/search?q=کرم-گردن-و-دکلته",
                label: "کرم گردن و دکلته",
              },
              { id: 11, path: "/search?q=آنتی-اکسیدان", label: "آنتی اکسیدان" },
            ],
          },
          {
            id: 2,
            path: "/search?q=بر-اساس-نیاز-پوست",
            label: "بر اساس نیاز پوست",
            subMenu: [
              {
                id: 1,
                path: "/search?q=تنظیم-کننده-چربی-پوست",
                label: "تنظیم کننده چربی پوست",
              },
              { id: 2, path: "/search?q=مات-کننده", label: "مات کننده" },
              {
                id: 3,
                path: "/search?q=مرطوب-کننده-و-آبرسان",
                label: "مرطوب کننده و آبرسان",
              },
              { id: 4, path: "/search?q=ضد-چروک", label: "ضد چروک" },
              {
                id: 5,
                path: "/search?q=ضد-پف-و-سیاهی-دور-چشم",
                label: "ضد پف و سیاهی دور چشم",
              },
              {
                id: 6,
                path: "/search?q=لیفتینگ-و-ضد-افتادگی",
                label: "لیفتینگ و ضد افتادگی",
              },
              { id: 7, path: "/search?q=ضد-لک", label: "ضد لک" },
              { id: 8, path: "/search?q=ضد-جوش", label: "ضد جوش" },
              { id: 9, path: "/search?q=شفاف-کننده", label: "شفاف کننده" },
              { id: 10, path: "/search?q=روشن-کننده", label: "روشن کننده" },
              { id: 11, path: "/search?q=ترمیم-کننده", label: "ترمیم کننده" },
              {
                id: 12,
                path: "/search?q=ضد-التهاب-و-ضد-خارش",
                label: "ضد التهاب و ضد خارش",
              },
              { id: 13, path: "/search?q=ضد-قرمزی", label: "ضد قرمزی" },
              {
                id: 14,
                path: "/search?q=ضد-ترک-اِسکار",
                label: "ضد ترک اِسکار",
              },
            ],
          },
        ],
      },
      {
        id: 3,
        path: "/search?q=محصولات-مو",
        label: "محصولات مو",
        subMenu: [
          {
            id: 1,
            path: "/search?q=مراقبت-مو",
            label: "مراقبت مو",
            subMenu: [
              { id: 1, path: "/search?q=شیرمو", label: "شیرمو" },
              { id: 2, path: "/search?q=شامپو-مو", label: "شامپو مو" },
              { id: 3, path: "/search?q=نرم-کننده-مو", label: "نرم کننده مو" },
              { id: 4, path: "/search?q=ماسک-مو", label: "ماسک مو" },
              { id: 5, path: "/search?q=کرم-مو", label: "کرم مو" },
              { id: 6, path: "/search?q=سرم-مو", label: "سرم مو" },
              { id: 7, path: "/search?q=روغن-مو", label: "روغن مو" },
              { id: 8, path: "/search?q=اسپری-2-فاز", label: "اسپری 2 فاز" },
              { id: 9, path: "/search?q=لوسیون-مو", label: "لوسیون مو" },
              { id: 10, path: "/search?q=شامپو-خشک", label: "شامپو خشک" },
            ],
          },
          {
            id: 2,
            path: "/search?q=رنگ-مو",
            label: "رنگ مو",
            subMenu: [
              { id: 1, path: "/search?q=رنگ-ابرو", label: "رنگ ابرو" },
              {
                id: 2,
                path: "/search?q=ریموور-رنگ-مو",
                label: "ریموور رنگ مو",
              },
              {
                id: 3,
                path: "/search?q=رژ-و-استیک-مو",
                label: "رژ و استیک مو",
              },
              {
                id: 4,
                path: "/search?q=ماسک-موی-رنگی",
                label: "ماسک موی رنگی",
              },
              { id: 5, path: "/search?q=کیت-رنگ-مو", label: "کیت رنگ مو" },
              {
                id: 6,
                path: "/search?q=رنگ-موی-تیوپی",
                label: "رنگ موی تیوپی",
              },
              { id: 7, path: "/search?q=اکسیدان", label: "اکسیدان" },
              {
                id: 8,
                path: "/search?q=شامپو-رنگ",
                label: "شامپو رنگ (رنگساژ)",
              },
              { id: 9, path: "/search?q=دکلره", label: "دکلره" },
              { id: 10, path: "/search?q=واریاسیون", label: "واریاسیون" },
            ],
          },
        ],
      },
      {
        id: 4,
        path: "/search?q=محصولات-حمام-و-بدن",
        label: "محصولات حمام و بدن",
        subMenu: [
          {
            id: 1,
            path: "/search?q=شوینده-بدن",
            label: "شوینده بدن",
            subMenu: [
              { id: 1, path: "/search?q=موس-بدن", label: "موس بدن" },
              { id: 2, path: "/search?q=فوم-بدن", label: "فوم بدن" },
              { id: 3, path: "/search?q=روغن-حمام", label: "روغن حمام" },
              { id: 4, path: "/search?q=اسکراب-بدن", label: "اسکراب بدن" },
              { id: 5, path: "/search?q=شامپو-بدن", label: "شامپو بدن" },
              {
                id: 6,
                path: "/search?q=پن-صورت-و-بدن",
                label: "پن (صابون) صورت و بدن",
              },
            ],
          },
          {
            id: 2,
            path: "/search?q=مراقبت-بدن",
            label: "مراقبت بدن",
            subMenu: [
              {
                id: 1,
                path: "/search?q=روشن-کننده-بدن",
                label: "روشن کننده بدن",
              },
              { id: 2, path: "/search?q=ضد-لک-بدن", label: "ضد لک بدن" },
              {
                id: 3,
                path: "/search?q=ترمیم-کننده-شقاق-سینه",
                label: "ترمیم کننده شقاق سینه",
              },
              {
                id: 4,
                path: "/search?q=فرم-دهنده-سینه-و-باسن",
                label: "فرم دهنده سینه و باسن",
              },
              { id: 5, path: "/search?q=ضد-آفتاب-بدن", label: "ضد آفتاب بدن" },
              {
                id: 6,
                path: "/search?q=اتو-برنز",
                label: "اتو برنز (بدون آفتاب)",
              },
              {
                id: 7,
                path: "/search?q=برنزه-کننده",
                label: "برنزه کننده (با آفتاب)",
              },
              {
                id: 8,
                path: "/search?q=افترسان",
                label: "افترسان (مراقبت بعد از آفتاب)",
              },
              { id: 9, path: "/search?q=ضد-جوش-بدن", label: "ضد جوش بدن" },
              { id: 10, path: "/search?q=ضد-سلولیت", label: "ضد سلولیت" },
              {
                id: 11,
                path: "/search?q=ضد-ترک-و-استرچ-مارک",
                label: "ضد ترک و استرچ مارک",
              },
              { id: 12, path: "/search?q=سفت-کننده", label: "سفت کننده" },
              {
                id: 13,
                path: "/search?q=ضد-درد-سوختگی-و-التهاب",
                label: "ضد درد، سوختگی و التهاب",
              },
              { id: 14, path: "/search?q=کرم-لاغری", label: "کرم لاغری" },
            ],
          },
        ],
      },
      {
        id: 5,
        path: "/search?q=محصولات-بهداشتی",
        label: "محصولات بهداشتی",
        subMenu: [
          {
            id: 1,
            path: "/search?q=بهداشت-و-مراقبت-بدن",
            label: "بهداشت و مراقبت بدن",
            subMenu: [
              { id: 1, path: "/search?q=گوش-پاک-کن", label: "گوش پاک کن" },
            ],
          },
          {
            id: 2,
            path: "/search?q=محصولات-دئودورانت-ضد-تعریق",
            label: "محصولات دئودورانت ضد تعریق",
            subMenu: [
              {
                id: 1,
                path: "/search?q=اسپری-ضد-تعریق",
                label: "اسپری ضد تعریق",
              },
              {
                id: 2,
                path: "/search?q=استیک-ضد-تعریق",
                label: "استیک ضد تعریق",
              },
              { id: 3, path: "/search?q=کرم-ضد-تعریق", label: "کرم ضد تعریق" },
              { id: 4, path: "/search?q=مام-ضد-تعریق", label: "مام ضد تعریق" },
            ],
          },
          {
            id: 3,
            path: "/search?q=بهداشت-دهان-و-دندان",
            label: "بهداشت دهان و دندان",
            subMenu: [
              { id: 1, path: "/search?q=زبان-پاک-کن", label: "زبان پاک کن" },
              { id: 2, path: "/search?q=مسواک", label: "مسواک" },
              { id: 3, path: "/search?q=دهانشویه", label: "دهانشویه" },
              { id: 4, path: "/search?q=نخ-دندان", label: "نخ دندان" },
              { id: 5, path: "/search?q=خمیر-دندان", label: "خمیر دندان" },
              { id: 6, path: "/search?q=مسواک-برقی", label: "مسواک برقی" },
            ],
          },
        ],
      },
      {
        id: 6,
        path: "/search?q=لوازم-برقی-شخصی",
        label: "لوازم برقی شخصی",
        subMenu: [
          {
            id: 1,
            path: "/search?q=سشوار-و-خشک-کن-مو",
            label: "سشوار و خشک کن مو",
            subMenu: [
              { id: 1, path: "/search?q=سشوار", label: "سشوار" },
              { id: 2, path: "/search?q=سشوار-چرخشی", label: "سشوار چرخشی" },
            ],
          },
          {
            id: 2,
            path: "/search?q=حالت-دهنده-برقی-مو",
            label: "حالت دهنده برقی مو",
            subMenu: [
              { id: 1, path: "/search?q=اتو-مو", label: "اتو مو" },
              {
                id: 2,
                path: "/search?q=برس-صاف-کننده-مو",
                label: "برس صاف کننده مو",
              },
              {
                id: 3,
                path: "/search?q=برس-حالت-دهنده-مو",
                label: "برس حالت دهنده مو",
              },
              { id: 4, path: "/search?q=بیگودی-برقی", label: "بیگودی برقی" },
              { id: 5, path: "/search?q=فر-کننده-مو", label: "فر کننده مو" },
            ],
          },
          {
            id: 3,
            path: "/search?q=اصلاح-موی-سر-و-صورت",
            label: "اصلاح موی سر و صورت",
            subMenu: [
              { id: 1, path: "/search?q=ریش-تراش", label: "ریش تراش" },
              {
                id: 2,
                path: "/search?q=ماشین-اصلاح-سر-و-صورت",
                label: "ماشین اصلاح سر و صورت",
              },
              {
                id: 3,
                path: "/search?q=ماشین-اصلاح-گوش-بینی-و-ابرو",
                label: "ماشین اصلاح گوش، بینی و ابرو",
              },
            ],
          },
        ],
      },
      {
        id: 7,
        path: "/search?q=عطر",
        label: "عطر",
        subMenu: [
          {
            id: 1,
            path: "/search?q=عطر-و-ادکلن-مردانه",
            label: "عطر و ادکلن مردانه",
          },
          {
            id: 2,
            path: "/search?q=عطر-و-ادکلن-زنانه",
            label: "عطر و ادکلن زنانه",
          },
          {
            id: 3,
            path: "/search?q=مشترک-مردانه-و-زنانه",
            label: "مشترک مردانه و زنانه",
          },
          {
            id: 4,
            path: "/search?q=ادکلن-کودک",
            label: "ادکلن کودک",
          },
          {
            id: 5,
            path: "/search?q=عطر-جیبی",
            label: "عطر جیبی (مینی سایز)",
          },
        ],
      },
      {
        id: 8,
        path: "/search",
        label: "جستجو",
      },
    ],
    languageMenu: [
      {
        id: "ar",
        name: "عربى - AR",
        value: "ar",
        icon: <SAFlag width='20px' height='15px' />,
      },
      {
        id: "zh",
        name: "چینى - ZH",
        value: "zh",
        icon: <CNFlag width='20px' height='15px' />,
      },
      {
        id: "en",
        name: "انگلیسی - EN",
        value: "en",
        icon: <USFlag width='20px' height='15px' />,
      },
      {
        id: "de",
        name: "آلمانى - DE",
        value: "de",
        icon: <DEFlag width='20px' height='15px' />,
      },
      {
        id: "he",
        name: "عبرى - HE",
        value: "he",
        icon: <ILFlag width='20px' height='15px' />,
      },
      {
        id: "es",
        name: "اسپانیایی - ES",
        value: "es",
        icon: <ESFlag width='20px' height='15px' />,
      },
    ],
    categoryMenu: [
      // محتوای categoryMenu از فایل اصلی
    ],
    pagesMenu: [
      // محتوای pagesMenu از فایل اصلی
    ],
  },
};
