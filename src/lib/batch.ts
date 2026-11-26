/**
 * Single source of truth for the Drone Technology Internship batch.
 *
 * A new batch starts on the 15th of every month (IST). The "next batch" is computed
 * automatically, so nothing here needs editing each month.
 */
const IST_OFFSET_MS = 5.5 * 3600 * 1000;
const BATCH_DAY = 15;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EXTERNAL_REGISTRATIONS: Record<string, number> = {
  "2026-12-15": 5,
};

/** Midnight IST on the 15th of the given month, as a UTC timestamp. */
const batchStartMs = (year: number, month: number) => Date.UTC(year, month, BATCH_DAY) - IST_OFFSET_MS;

export function getBatch(now = Date.now()) {
  const ist = new Date(now + IST_OFFSET_MS);
  let year = ist.getUTCFullYear(), month = ist.getUTCMonth();
  // On or after the 15th the current batch has begun, so the next one is next month's.
  if (ist.getUTCDate() >= BATCH_DAY) month += 1;
  const start = batchStartMs(year, month);
  const prevStart = batchStartMs(year, month - 1);
  const startDate = new Date(start + IST_OFFSET_MS);
  return {
    startDate: startDate.toISOString().slice(0, 10),
    startLabel: `${BATCH_DAY} ${MONTHS[startDate.getUTCMonth()]} ${startDate.getUTCFullYear()}`,
    /** Enrolments paid on/after this instant count toward the upcoming batch's seats. */
    windowStart: new Date(prevStart).toISOString(),
  };
}

/** Live view of the upcoming batch; every read re-evaluates against the current time. */
export const BATCH = {
  get startDate() { return getBatch().startDate; },
  get startLabel() { return getBatch().startLabel; },
  get windowStart() { return getBatch().windowStart; },
  /** Total seats in each batch. Seats left = seatCap − paid enrolments in the batch window. */
  seatCap: 30,
  /**
   * Registrations taken outside the site (external Razorpay link / Google Form), keyed by
   * batch start date. Update the number as more come in; a new batch starts at 0 automatically.
   */
  get externalRegistrations() { return EXTERNAL_REGISTRATIONS[getBatch().startDate] ?? 0; },
  /** Hide the "seats left" counter until it is at or below this number. */
  showSeatsBelow: 30,
};

export const PRICING = {
  /** Struck-through anchor price, in paise. */
  anchor: 1199900,
  /** Regular price, in paise. */
  regular: 699900,
  /** Flat discount from a visitor's personal scratch offer, in paise. */
  scratchDiscount: 100000,
  /** Each visitor's code is `${scratchPrefix}-XXXXXX`. */
  scratchPrefix: "EARLY1000",
  /** How long a personal offer stays valid after it is scratched. */
  scratchHours: 24,
} as const;

/**
 * Time-boxed sale. It switches on and off by itself (IST); the server enforces the window.
 * The code and discount must match the `enrolments_coupon_discount_valid` database constraint.
 */
export const SALE = {
  name: "Black Friday",
  code: "BLACKFRIDAY",
  /** Flat discount in paise. */
  discount: 300000,
  /** Live as soon as it is deployed, through the end of Black Friday. */
  startsAt: Date.parse("2026-11-26T00:00:00+05:30"),
  endsAt: Date.parse("2026-11-28T00:00:00+05:30"),
  startLabel: "26 November",
} as const;

export const salePrice = PRICING.regular - SALE.discount;
export const saleActive = (now = Date.now()) => now >= SALE.startsAt && now < SALE.endsAt;
export const scratchPrice = PRICING.regular - PRICING.scratchDiscount;
export const isScratchCode = (code: string | null | undefined) => typeof code === "string" && code.toUpperCase().startsWith(`${PRICING.scratchPrefix}-`);
