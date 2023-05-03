export default function () {
  const { ssrContext } = useNuxtApp();
  return useState("session", () => ssrContext?.event?.context?.session);
}
