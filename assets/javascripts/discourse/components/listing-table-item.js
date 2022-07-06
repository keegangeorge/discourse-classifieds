import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";
import { LISTING_STATUSES } from "../lib/constants";
import DiscourseURL from "discourse/lib/url";

export default class ListingItem extends GlimmerComponent {
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
  routeToTopic(id) {
    DiscourseURL.routeTo(`/t/${id}`);
  }
}
