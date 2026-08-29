import { useCompare } from "@contexts/compare/compare.context";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";

export default function CompareButton() {
  const { totalItems } = useCompare();
  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTES.COMPARE);
  };

  return (
    <button
      className="relative flex items-center justify-center flex-shrink-0 h-auto transform focus:outline-none"
      aria-label="compare-button"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="w-5 h-auto"
      >
        <path
          d="M358.976 32.064l-34.688 32C307.808 57.504 296.96 64 285.44 64h-63.36l44.8-38.784c28.16-24.32 36.544-55.36 28.032-83.136C289.92 19.168 267.008 8 240 8c-21.12 0-40.832 7.68-55.296 21.504L78.912 129.6C55.04 151.872 48 181.632 58.624 206.272c10.624 24.64 34.112 40.384 59.584 40.384H256V448h80c26.496 0 48-21.504 48-48V32.064h-25.024zM240 32c8.832 0 16 7.168 16 16s-7.168 16-16 16-16-7.168-16-16 7.168-16 16-16zM80 160l106.624-92.416C202.432 51.2 221.12 40 240 40c26.496 0 50.432 15.168 64.896 38.4H368c8.832 0 16 7.168 16 16V288c0 17.664-14.336 32-32 32H118.272c-25.44 0-48.96-15.744-59.584-40.384C44.992 256.256 40 241.664 40 224c0-8.832 3.2-16.896 8.896-22.912L80 160z"
          fill="currentColor"
        />
      </svg>

      <span className="cart-counter-badge flex items-center justify-center bg-heading text-white absolute -top-2.5 xl:-top-3 ltr:-right-2.5 ltr:xl:-right-3 rtl:-left-2.5 rtl:xl:-left-3 rounded-full font-bold">
        {totalItems}
      </span>
    </button>
  );
}
