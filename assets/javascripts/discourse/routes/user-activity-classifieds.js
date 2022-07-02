import DiscourseRoute from "discourse/routes/discourse";
import Classifieds from "../models/classifieds";
import { all } from "rsvp";

export default DiscourseRoute.extend({
  model() {
    const user = this.modelFor("user");
    return all([
      user,
      Classifieds.list(`/u/${user.username}/activity/classifieds.json`),
    ]);
  },

  setupController(controller, model) {
    controller.setProperties({
      user: model[0],
      classifieds: model[1],
    });
  },
});
