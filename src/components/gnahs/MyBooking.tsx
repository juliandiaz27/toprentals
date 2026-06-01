"use client";

import { useEffect } from "react";
import {
  getGnahsMyBookingConfig,
  GNAHS_MY_BOOKING_LAUNCHER,
} from "@/lib/gnahs/config";
import { loadScript } from "@/lib/gnahs/scripts";

/**
 * Confirmación y gestión de reservas — contenedor #GNAHS-my-booking.
 * @see https://docs.gnahs.com/2.0/booking-engine/basic-integration-booking-engine
 */
export function MyBooking() {
  useEffect(() => {
    if (!window.GNAHS_MyBooking) {
      window.GNAHS_MyBooking = getGnahsMyBookingConfig();
    }

    return loadScript(GNAHS_MY_BOOKING_LAUNCHER, {
      id: "gnahs-my-booking-launcher",
      defer: true,
      appendTo: "body",
    });
  }, []);

  return null;
}
