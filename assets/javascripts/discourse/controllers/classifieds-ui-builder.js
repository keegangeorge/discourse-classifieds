import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";
import { A } from "@ember/array";

export default Controller.extend(ModalFunctionality, {
  listingImages: A(),

  @discourseComputed
  conditionTypes() {
    const options = [
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.new"),
        value: "New",
      },
      {
        name: I18n.t(
          "discourse_classifieds.ui_builder.condition_options.like_new"
        ),
        value: "Like New",
      },
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.good"),
        value: "Good",
      },
      {
        name: I18n.t("discourse_classifieds.ui_builder.condition_options.fair"),
        value: "Fair",
      },
    ];

    return options;
  },

  @discourseComputed(
    "title",
    "description",
    "price",
    "location",
    "condition",
    "listingImages"
  )
  listingOutput(title, description, price, loc, condition, images) {
    let header = "[listing";
    let output = "";

    if (title) {
      header += ` title="${title}"`;
    }

    if (price) {
      header += ` price="${price}"`;
    }

    if (condition) {
      header += ` condition="${condition}"`;
    }

    if (loc) {
      header += ` location="${loc}"`;
    }

    header += "]";
    output += `${header}\n`;

    // Output
    if (description) {
      output += `${description.trim()}\n`;
    }

    if (images) {
      images.forEach((image, index) => {
        const buildImageFile = `![${image.file_name}|${image.width}x${image.height}](${image.short_url})\n`;
        if (index === 0) {
          output += `[coverImage]\n${buildImageFile}[/coverImage]\n`;
        } else {
          output += buildImageFile;
        }
      });
    }

    output += "[/listing]\n";
    return output;
  },

  @action
  createListing() {
    this.toolbarEvent.addText(this.listingOutput);
    this.send("closeModal");
  },

  @action
  uploadDone(upload) {
    const listingImages = this.listingImages;
    listingImages.pushObject(upload);
  },

  resetProperties() {
    return this.setProperties({
      title: "",
      description: "",
      price: "",
      location: "",
      condition: "",
      listingImages: A(),
    });
  },

  @action
  cancelListingCreation() {
    this.resetProperties();
    this.send("closeModal");
  },
});
