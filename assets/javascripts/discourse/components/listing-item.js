import GlimmerComponent from "discourse/components/glimmer";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
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
