import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";

export default Controller.extend(ModalFunctionality, {
  @discourseComputed
  conditionTypes() {
    const options = [
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.new"),
        value: "new",
      },
      {
        name: I18n.t(
          "discourse_classifieds.ui_builder.condition_options.like_new"
        ),
        value: "likeNew",
      },
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.good"),
        value: "good",
      },
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.fair"),
        value: "fair",
      },
    ];

    return options;
  },

  @action
  createListing() {
    // this.toolbarEvent.addText(this.listingOutput);
    this.toolbarEvent.addText("My new listing! YAY");
    this.send("closeModal");
  },

  @action
  uploadDone(upload) {
    console.log("upload file", upload);
  },
});
