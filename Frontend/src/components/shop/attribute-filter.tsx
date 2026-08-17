import { CheckBox } from "@components/ui/checkbox";
import { useAttributesQuery } from "@framework/attribute/get-all-attributes";
import { useRouter } from "next/router";
import React from "react";

/**
 * Dynamic attribute filters (جنس، رنگ، سایز، ...) built from the attribute
 * values that actually exist in Strapi. Selected values are stored in the
 * `attr` URL query param as a comma-separated list of attribute-value ids.
 */
export const AttributeFilter = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { data: attributes, isLoading } = useAttributesQuery();

  const selectedValues = query?.attr
    ? (query.attr as string).split(",")
    : [];
  const [formState, setFormState] = React.useState<string[]>(selectedValues);

  React.useEffect(() => {
    setFormState(selectedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.attr]);

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    const currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value)
      : [...formState, value];
    const { attr, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { attr: currentFormState.join(",") }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }

  if (isLoading || !attributes || attributes.length === 0) {
    return null;
  }

  return (
    <>
      {attributes.map((attribute) => (
        <div
          key={attribute.id}
          className="block border-b border-gray-300 pb-7 mb-7"
        >
          <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
            {attribute.title}
          </h3>
          <div className="mt-2 flex flex-col space-y-4">
            {attribute.values.map((value) => (
              <CheckBox
                key={value.id}
                label={value.title}
                name={`${attribute.title}-${value.title}`}
                checked={formState.includes(String(value.id))}
                value={String(value.id)}
                onChange={handleItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
