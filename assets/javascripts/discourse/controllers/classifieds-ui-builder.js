import Controller from "@ember/controller";
import { action } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";
import I18n from "I18n";
import { A } from "@ember/array";
import { getOwner } from "discourse-common/lib/get-owner";
import { tracked } from "@glimmer/tracking";

export default class extends Controller {
  @tracked listingImages = A();

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
  }

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

    output += "[/listing]\n";

    if (!images) {
      return output;
    }

    let imageOutput = "[photographs]\n";
    images.forEach((image) => {
      imageOutput += `![${image.file_name}|${image.width}x${image.height}](${image.short_url})\n`;
    });
    imageOutput += "[/photographs]\n";

    return output + imageOutput;
  }

  @action
  createListing() {
    this.toolbarEvent.addText(this.listingOutput);
    const composer = getOwner(this).lookup("controller:composer");
    const listingDetails = {
      title: this.get("title"),
      description: this.get("description"),
      price: this.get("price"),
      condition: this.get("condition"),
      location: this.get("location"),
      images: this.get("listingImages"),
    };

    composer.model.set("listingDetails", listingDetails);

    this.send("closeModal");
  }

  @action
  uploadDone(upload) {
    const listingImages = this.listingImages;
    listingImages.pushObject(upload);
  }

  resetProperties() {
    return this.setProperties({
      title: "",
      description: "",
      price: "",
      location: "",
      condition: "",
      listingImages: A(),
    });
  }

  @action
  cancelListingCreation() {
    this.resetProperties();
    this.send("closeModal");
  }
}
