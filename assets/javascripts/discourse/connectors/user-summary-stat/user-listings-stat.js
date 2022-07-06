import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default {
  setupComponent(args, component) {
    const username = args.user.username;

    ajax(`/u/${username}/activity/classifieds.json`)
      .then(({ classifieds }) => {
        return component.set("numListings", classifieds.length);
      })
      .catch(popupAjaxError);
  },
};
