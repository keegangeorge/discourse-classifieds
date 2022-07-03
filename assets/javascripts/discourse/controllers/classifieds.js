import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class extends Controller {
  @tracked viewStyle = this.siteSettings.classifieds_default_view;

  get viewAttributes() {
    if (this.viewStyle === "grid") {
      return {
        icon: "list-ul",
        title: "discourse_classifieds.toolbar.view_options.list",
      };
    } else if (this.viewStyle === "list") {
      return {
        icon: "th-large",
        title: "discourse_classifieds.toolbar.view_options.grid",
      };
    }
  }

  @action
  toggleView() {
    if (this.viewStyle === "grid") {
      this.viewStyle = "list";
    } else if (this.viewStyle === "list") {
      this.viewStyle = "grid";
    }
  }
}
