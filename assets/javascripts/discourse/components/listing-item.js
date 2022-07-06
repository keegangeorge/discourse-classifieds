import GlimmerComponent from "discourse/components/glimmer";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { LISTING_STATUSES } from "../lib/constants";
export default class ListingItem extends GlimmerComponent {
  @tracked currentImageIndex = 0;
  maxDisplay = this.args.listing.images.length;
  max = this.args.listing.images.length - 1;

  get currentImage() {
    return this.args.listing.images[this.currentImageIndex].url;
  }

  get currentImageIndexDisplay() {
    return this.currentImageIndex + 1;
  }

  get imageMetaData() {
    return `Image ${this.currentImageIndexDisplay} of ${this.maxDisplay}`;
  }

  get listingStatusColor() {
    const status = this.args.listing.listingStatus;
    const prefix = "listing-status";
    switch (status) {
      case LISTING_STATUSES.active:
        return `${prefix}-active`;
        break;
      case LISTING_STATUSES.pending:
        return `${prefix}-pending`;
      case LISTING_STATUSES.sold:
        return `${prefix}-sold`;
      default:
        return `${prefix}-hidden`;
        break;
    }
    if (status === LISTING_STATUSES.active) {
      return "listing-status-active";
    }
  }

  get userAvatar() {
    return this.args.listing.userAvatar.replace("{size}", "25");
  }

  @action
  nextImage(index) {
    if (index < this.max) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  @action
  previousImage(index) {
    if (index === 0) {
      this.currentImageIndex = this.max;
    } else {
      this.currentImageIndex--;
    }
  }
}
