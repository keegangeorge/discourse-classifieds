export function setup(helper) {
  if (!helper.markdownIt) {
    return;
  }

  helper.allowList(["div.classified-listing", "div.cover-image"]);

  helper.registerOptions((opts, siteSettings) => {
    opts.features["listing"] = !!siteSettings.discourse_classifieds_enabled;
    opts.features["coverImage"] = !!siteSettings.discourse_classifieds_enabled;
  });

  helper.registerPlugin((md) => {
    md.block.bbcode.ruler.push("listing", {
      tag: "listing",

      wrap(token, info) {
        token.tag = "div";
        token.attrs = [["class", "classified-listing"]];

        Object.keys(info.attrs).forEach((key) => {
          const value = info.attrs[key];

          if (typeof value !== "undefined") {
            token.attrs.push([`data-${dasherize(key)}`, value]);
          }
        });

        return true;
      },
    });
  });

  // helper.registerPlugin((md) => {
  //   md.block.bbcode.ruler.push("coverImage", {
  //     tag: "coverImage",
  //     wrap: "div",
  //   });
  // });
}

function dasherize(input) {
  return input.replace(/[A-Z]/g, function (char, index) {
    return (index !== 0 ? "-" : "") + char.toLowerCase();
  });
}
