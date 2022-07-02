import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";
import { iconHTML } from "discourse-common/lib/icon-library";
import { htmlSafe } from "@ember/template";

export default Controller.extend({
  get emptyState() {
    const profileName = this.user.name || this.user.username;

    if (this.currentUser.id === this.user.id) {
      return {
        title: I18n.t("discourse_classifieds.user_activity.empty_state.title"),
        body: htmlSafe(
          I18n.t("discourse_classifieds.user_activity.empty_state.body", {
            icon: iconHTML("ad"),
          })
        ),
      };
    } else {
      return {
        title: I18n.t(
          "discourse_classifieds.user_activity.empty_state_others.title"
        ),
        body: htmlSafe(
          I18n.t(
            "discourse_classifieds.user_activity.empty_state_others.body",
            {
              user: profileName,
            }
          )
        ),
      };
    }
  },
});
