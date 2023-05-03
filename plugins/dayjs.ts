/* eslint-disable import/no-named-as-default-member */
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default defineNuxtPlugin(() => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return {
    provide: {
      dayjs,
    },
  };
});
