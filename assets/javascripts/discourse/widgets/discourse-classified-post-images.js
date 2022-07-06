import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import RawHtml from "discourse/widgets/raw-html";

export default createWidget("discourse-classified-post-images", {
  tagName: "div",
  buildKey: (attrs) => `discourse-classified-${attrs.id}-images`,

  html(attrs) {
    const contents = [];
    for (const image of attrs.images) {
      const lightboxImage = h(
        "a.lightbox",
        {
          attributes: {
            href: image.src,
            "data-download-href": image.src,
            title: image.alt,
          },
        },
        new RawHtml({ html: image })
      );

      const lightbox = h("div.lightbox-wrapper", lightboxImage);
      contents.push(lightbox);
    }

    return h("div.classified-listing-post-gallery", contents);
  },
});
