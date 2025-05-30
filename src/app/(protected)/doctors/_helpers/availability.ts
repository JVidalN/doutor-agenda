import dayjs from "dayjs";
import locale from "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/db/schema";

dayjs.extend(utc);
dayjs.locale(locale);

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const now = dayjs();

  const from = now
    .startOf("week")
    .add(doctor.availableFromWeekDay, "day")
    .utc()
    .set("hour", Number(doctor.availableFromTime.split(":")[0]))
    .set("minute", Number(doctor.availableFromTime.split(":")[1]))
    .set("second", Number(doctor.availableFromTime.split(":")[2] || 0))
    .local();

  const to = now
    .startOf("week")
    .add(doctor.availableToWeekDay, "day")
    .utc()
    .set("hour", Number(doctor.availableToTime.split(":")[0]))
    .set("minute", Number(doctor.availableToTime.split(":")[1]))
    .set("second", Number(doctor.availableToTime.split(":")[2] || 0))
    .local();

  return {
    from,
    to,
  };
};
