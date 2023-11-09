import { dayjs } from "@/server/utils/dayjs";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs,
    },
  };
});
