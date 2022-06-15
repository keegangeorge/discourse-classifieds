import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import DiscourseRoute from "discourse/routes/discourse";
import I18n from "I18n";

export default DiscourseRoute.extend({
  model() {
    return ajax(`/classifieds.json`).catch(popupAjaxError);
  },

  titleToken() {
    return I18n.t("discourse_classifieds.title");
  },

  setupController(controller, model) {
    const { classifieds } = model;
    controller.set("classifieds", classifieds);
  },
});
