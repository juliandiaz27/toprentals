import type { ReactNode } from "react";
import {
  GNAHS_WIDGET_SKIN_CLASS,
  gnahsWidgetSkinClass,
  gnahsWidgetTopRentalsSkinCss,
  type GnahsWidgetSkinVariant,
} from "./topRentalsGnahsSkinCss";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: GnahsWidgetSkinVariant;
};

export function GnahsWidgetTopRentalsSkin({
  children,
  className = "",
  variant = "default",
}: Props) {
  const skinClass = gnahsWidgetSkinClass(variant);
  return (
    <div className={`${skinClass} ${className}`.trim()}>
      <style
        dangerouslySetInnerHTML={{
          __html: gnahsWidgetTopRentalsSkinCss(GNAHS_WIDGET_SKIN_CLASS, variant),
        }}
      />
      {children}
    </div>
  );
}
