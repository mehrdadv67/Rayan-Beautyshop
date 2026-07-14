import React from "react";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";

interface MenuItem {
  id: number | string;
  path: string;
  label: string;
  columnItemItems?: MenuItem[];
}
type MegaMenuProps = {
  columns: {
    id: number | string;
    columnItems: MenuItem[];
  }[];
};

const COLUMN_WIDTH = 200;

const MegaMenu: React.FC<MegaMenuProps> = ({ columns }) => {
  const { t } = useTranslation("menu");

  // Flatten every group (title + sub-items) from all data columns
  const groups = React.useMemo(
    () =>
      columns
        .flatMap((col) => col.columnItems ?? [])
        .filter(
          (item) =>
            item && (item.label || (item.columnItemItems?.length ?? 0) > 0)
        ),
    [columns]
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = React.useState<number>(() =>
    Math.min(Math.max(columns.length, 1), Math.max(groups.length, 1))
  );

  // Spread groups into `columnCount` columns, balancing by total item count
  const columnsToRender = React.useMemo(() => {
    const count = Math.min(columnCount, Math.max(groups.length, 1));
    const cols: { items: MenuItem[]; weight: number }[] = Array.from(
      { length: count },
      () => ({ items: [], weight: 0 })
    );
    groups.forEach((group) => {
      const lightest = cols.reduce((min, c) =>
        c.weight < min.weight ? c : min
      );
      lightest.items.push(group);
      lightest.weight += 1 + (group.columnItemItems?.length ?? 0);
    });
    return cols.map((c) => c.items).filter((items) => items.length > 0);
  }, [groups, columnCount]);

  // If the open menu is taller than the available viewport height, add a column
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const available = window.innerHeight - rect.top - 24;
    if (el.scrollHeight > available && columnCount < groups.length) {
      setColumnCount((c) => Math.min(c + 1, groups.length));
    }
  }, [columnCount, groups.length]);

  return (
    <div
      ref={containerRef}
      className='absolute bg-gray-200 megaMenu shadow-header top-full ltr:left-0 rtl:right-0 rounded-2xl overflow-hidden'
      style={{ width: `${columnsToRender.length * COLUMN_WIDTH}px` }}
    >
      <div className='flex gap-4 p-2'>
        {columnsToRender.map((groupList, ci) => (
          <ul className='pt-4 pb-5 w-48' key={ci}>
            {groupList.map((group, gi) => (
              <React.Fragment key={group.id}>
                <li
                  className={`mb-1.5 ${
                    gi === 0
                      ? "pt-1"
                      : "pt-3 mt-3 border-t border-gray-300"
                  }`}
                >
                  <Link
                    href={group.path}
                    className='block text-sm py-1 text-heading font-semibold px-4 hover:text-heading hover:bg-gray-300'
                  >
                    {t(group.label)}
                  </Link>
                </li>
                {group?.columnItemItems?.map((item: any) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className='text-body text-sm block py-1 px-4 hover:text-heading hover:bg-gray-300'
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
