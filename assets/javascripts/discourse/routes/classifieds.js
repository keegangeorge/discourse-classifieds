import DiscourseRoute from "discourse/routes/discourse";
import I18n from "I18n";
import Classifieds from "../models/classifieds";

export default DiscourseRoute.extend({
  model() {
    return Classifieds.list("classifieds.json");
  },

  titleToken() {
    return I18n.t("discourse_classifieds.title");
  },

  setupController(controller, model) {
    controller.set("classifieds", model);
  },
});
