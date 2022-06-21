import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { getRegister } from "discourse-common/lib/get-owner";
import WidgetGlue from "discourse/widgets/glue";

export default apiInitializer("1.2.0", (api) => {
  const PLUGIN_ID = "discourse-classifieds";
  const siteSettings = api.container.lookup("site-settings:main");
  const register = getRegister(api);
  let _glued = [];

  function rerender() {
    _glued.forEach((g) => g.queueRerender());
  }

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

  api.modifyClass("controller:composer", {
    pluginId: PLUGIN_ID,

    @discourseComputed(
      "siteSettings.discourse_classifieds_enabled",
      "model.creatingTopic",
      "model.editingPost",
      "model.topicFirstPost"
    )
    canCreateClassified(classifiedsEnabled, creatingTopic, editing, firstPost) {
      // TODO add minimum trust level and/or other options
      return classifiedsEnabled && (creatingTopic || (editing && firstPost));
    },

    // save() {
    //   const toolbarEvent = this.get("toolbarEvent");
    //   // console.log("toolbarEvent", toolbarEvent, "this", this);
    // },

    actions: {
      showClassifiedsBuilder() {
        showModal("classifieds-ui-builder").set(
          "toolbarEvent",
          this.toolbarEvent
        );
      },
    },
  });

  api.addToolbarPopupMenuOptionsCallback(() => {
    return {
      action: "showClassifiedsBuilder",
      icon: "ad",
      label: "discourse_classifieds.ui_builder.title",
      condition: "canCreateClassified",
    };
  });

  // ? TODO: Move to separate initializer ?

  function attachListing(elem, helper) {
    let listingNodes = [...elem.querySelectorAll(".classified-listing")];

    if (!listingNodes.length || !helper) {
      return;
    }

    const post = helper.getModel();
    api.preventCloak(post.id);

    listingNodes.forEach((listingNode) => {
      const dataset = listingNode.dataset;

      const attrs = {
        id: `discourse-classified-${post.id}`,
        ...dataset,
      };

      const glue = new WidgetGlue("discourse-classified-post", register, attrs);
      console.log(glue);
      glue.appendTo(listingNode);
      _glued.push(glue);
    });
  }

  api.decorateCookedElement(attachListing, {
    onlyStream: true,
    id: "discourse-classifieds-post",
  });
});
