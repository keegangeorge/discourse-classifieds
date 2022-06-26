import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import RawHtml from "discourse/widgets/raw-html";

export default createWidget("discourse-classified-post-images", {
  tagName: "div",
  buildKey: (attrs) => `discourse-classified-${attrs.id}-images`,

  html(attrs) {
    const contents = [];
    for (const image of attrs.images) {
      contents.push(new RawHtml({ html: image }));
    }

    return h("div.classified-listing-post-gallery", contents);
  },
});
