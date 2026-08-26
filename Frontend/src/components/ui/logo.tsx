import Image from "next/image";
import Link from "@components/ui/link";
import cn from "classnames";
import { siteSettings } from "@settings/site-settings";
import { useSiteConfig } from "@contexts/site-config.context";

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { logo, loaded } = useSiteConfig();
  const logoSrc = loaded && logo.url ? logo.url : siteSettings.logo.url;
  const logoWidth =
    loaded && logo.url
      ? logo.width || siteSettings.logo.width
      : siteSettings.logo.width;
  const logoHeight =
    loaded && logo.url
      ? logo.height || siteSettings.logo.height
      : siteSettings.logo.height;

  return (
    <Link
      href={siteSettings.logo.href}
      className={cn("inline-flex focus:outline-none", className)}
      {...props}
    >
      <Image
        src={logoSrc}
        alt={siteSettings.logo.alt}
        height={50}
        width={100}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
