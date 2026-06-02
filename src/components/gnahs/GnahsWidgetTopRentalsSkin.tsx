import type { ReactNode } from "react";
import {
  GNAHS_WIDGET_SKIN_CLASS,
  gnahsWidgetTopRentalsSkinCss,
} from "./topRentalsGnahsSkinCss";

type Props = {
  children: ReactNode;
  className?: string;
};

export function GnahsWidgetTopRentalsSkin({ children, className = "" }: Props) {
  return (
    <div className={`${GNAHS_WIDGET_SKIN_CLASS} ${className}`.trim()}>
      <style dangerouslySetInnerHTML={{ __html: gnahsWidgetTopRentalsSkinCss() }} />
      {children}
    </div>
  );
}
