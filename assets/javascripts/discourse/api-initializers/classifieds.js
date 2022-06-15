import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";

export default apiInitializer("1.2.0", (api) => {
  const PLUGIN_ID = "discourse-classifieds";

  const siteSettings = api.container.lookup("site-settings:main");

  if (!siteSettings.discourse_classifieds_enabled) {
    return;
  }

  if (siteSettings.classifieds_add_to_hamburger_menu) {
    api.decorateWidget("hamburger-menu:generalLinks", () => {
      return {
        route: "classifieds",
        label: "discourse_classifieds.title",
        className: "classifieds-link",
      };
    });
  }

  if (siteSettings.classifieds_add_to_top_menu) {
    api.addNavigationBarItem({
      name: "classifieds",
      displayName: I18n.t("discourse_classifieds.title"),
      href: "/classifieds",
    });
  }

});
