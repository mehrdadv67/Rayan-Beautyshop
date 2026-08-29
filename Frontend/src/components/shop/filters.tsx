import { CategoryFilter } from "./category-filter";
import { BrandFilter } from "./brand-filter";
import { FilteredItem } from "./filtered-item";
import { AttributeFilter } from "./attribute-filter";
import { PriceFilter } from "./price-filter";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "next-i18next";

export const ShopFilters: React.FC = () => {
	const router = useRouter();
	const { pathname, query } = router;
	const { t } = useTranslation("common");
	const activeFilters = Object.values(query).filter((v) => v && v !== "undefined" && v !== "null");
	return (
		<div className="pt-1">
			<div className="block border-b border-gray-300 pb-7 mb-7">
				<div className="flex items-center justify-between mb-2.5">
					<h2 className="font-semibold text-heading text-xl md:text-2xl">
						{t("text-filters")}
					</h2>
					{activeFilters.length > 0 && (
						<button
							className="flex-shrink text-xs mt-0.5 transition duration-150 ease-in focus:outline-none hover:text-heading"
							aria-label="Clear All"
							onClick={() => {
								router.push(pathname);
							}}
						>
							{t("text-clear-all")}
						</button>
					)}
				</div>
				{activeFilters.length > 0 && (
					<p className="text-xs text-body mb-2">
						{activeFilters.length} {t("text-filters-active")}
					</p>
				)}
				<div className="flex flex-wrap -m-1.5 pt-2">
					{Object.entries(query)
						.filter(([, value]) => typeof value === 'string' && value && value !== 'undefined' && value !== 'null')
						.map(([key, value]) => {
							const values = String(value).split(",");
							return values.map((v, idx) => (
								<FilteredItem
									itemKey={key}
									itemValue={v}
									key={`${key}-${idx}`}
								/>
							));
						})}
				</div>
			</div>

			<CategoryFilter />
			<BrandFilter />
			<PriceFilter />
			<AttributeFilter />
		</div>
	);
};
