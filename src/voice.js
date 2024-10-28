import { EndBehaviorType } from "@discordjs/voice";
import config from "./config.js";

export function hasSubscription(receiver, user) {
  return !!receiver.subscriptions.get(user.id);
}

export function subscribe(receiver, user) {
  return receiver.subscribe(user.id, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: config.afterSilenceDuration,
    },
  });
}
