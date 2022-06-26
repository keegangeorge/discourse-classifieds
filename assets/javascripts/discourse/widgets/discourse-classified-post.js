import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";

export default createWidget("discourse-classified-post", {
  tagName: "div",
  buildKey: (attrs) => `discourse-classified-${attrs.id}`,

  html(attrs) {
    return h("div.classified-listing-post", [
      this.buildTitleBar(attrs),
      h("div", { innerHTML: attrs.description }),
    ]);
  },

  buildTitleBar(attrs) {
    const { title, price, condition, location } = attrs;
    // TODO fix price currency?
    return h("div.listing-post-title-bar", [
      h("h3.listing-post-title", title),
      h("h4.listing-post-price", `($${price})`),
      h("span.listing-post-location", [iconNode("map-marker-alt"), location]),
      h("span.listing-post-condition", condition),
    ]);
  },
});
