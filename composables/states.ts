export const useYearForm = () =>
  useState("year", () => ({
    startDate: "",
    endDate: "",
  }));
