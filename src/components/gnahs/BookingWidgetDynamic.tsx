"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { getGnahsWidgetConfig } from "@/lib/gnahs/config";
import type { BookingWidgetLabels } from "./BookingWidget";
import { BookingWidgetSkeleton } from "./BookingWidgetFallback";

type WidgetConfig = ReturnType<typeof getGnahsWidgetConfig>;

type Props = {
  config: WidgetConfig;
  hidePromo?: boolean;
  labels?: BookingWidgetLabels;
};

/** Carga el buscador GNAHS solo en el navegador (sin SSR). */
export const BookingWidget = dynamic(
  () => import("./BookingWidget").then((mod) => mod.BookingWidget),
  {
    ssr: false,
    loading: () => <BookingWidgetSkeleton />,
  },
) as ComponentType<Props>;
