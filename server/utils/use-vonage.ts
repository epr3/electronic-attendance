import { Auth } from "@vonage/auth";
import { SMS } from "@vonage/sms";

export function useVonage() {
  const config = useRuntimeConfig();

  const auth = new Auth({
    apiKey: config.vonageApiKey as string,
    apiSecret: config.vonageApiSecret as string,
  });

  const vonage = new SMS(auth);

  return vonage;
}
