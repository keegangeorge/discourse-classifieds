import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import showModal from "discourse/lib/show-modal";
import { getRegister } from "discourse-common/lib/get-owner";
import WidgetGlue from "discourse/widgets/glue";
import { CUSTOM_FIELDS, LISTING_STATUSES } from "../lib/constants";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default apiInitializer("1.2.0", (api) => {
  const PLUGIN_ID = "discourse-classifieds";
  const siteSettings = api.container.lookup("site-settings:main");
  const register = getRegister(api);
  let _glued = [];
  const currentUser = api.getCurrentUser();

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

    save() {
      const model = this.model;
      const contents = model.reply;

      // TODO: Improve check for listing (bbcode tokenization?)
      if (contents.includes("[listing") && contents.includes("[/listing]")) {
        model.set("isClassifiedListing", true);
        model.set("listingStatus", LISTING_STATUSES.active);
      } else {
        model.set("isClassifiedListing", false);
      }

      return this._super(...arguments);
    },

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
        description: listingNode.innerHTML,
      };

      const glue = new WidgetGlue("discourse-classified-post", register, attrs);
      glue.appendTo(listingNode);
      _glued.push(glue);
    });
  }

  function attachListingImages(elem, helper) {
    let photographNodes = [...elem.querySelectorAll(".listing-images")];

    if (!photographNodes.length || !helper) {
      return;
    }

    const post = helper.getModel();
    api.preventCloak(post.id);

    photographNodes.forEach((photographNode) => {
      const images = photographNode.getElementsByTagName("img");

      const attrs = {
        id: `discourse-classified-images-${post.id}`,
        images,
      };

      const glue = new WidgetGlue(
        "discourse-classified-post-images",
        register,
        attrs
      );
      glue.appendTo(photographNode);
      _glued.push(glue);
    });
  }

  api.decorateCookedElement(attachListing, {
    onlyStream: true,
    id: "discourse-classifieds-post",
  });

  api.decorateCookedElement(attachListingImages, {
    onlyStream: true,
    id: "discourse-classifieds-post-images",
  });

  // Serialize Custom Fields:
  CUSTOM_FIELDS.forEach((field) => {
    api.serializeOnCreate(field.name);
    api.serializeToDraft(field.name);
    api.serializeToTopic(field.name, `topic.${field.name}`);
  });

  // Add Status Control Button to Post:
  api.decorateTopicTitle((topicModel, node, topicTitleType) => {
    if (topicModel.isClassifiedListing && topicTitleType === "topic-title") {
      const wrapper = document.createElement("span");
      wrapper.classList.add("topic-title-listing-status");
      wrapper.setAttribute("data-status", topicModel.listingStatus);
      const text = document.createTextNode(topicModel.listingStatus);
      wrapper.appendChild(text);
      node.appendChild(wrapper);
    }
  });

  const topicRoute = api.container.lookup("route:topic");

  if (currentUser) {
    api.addPostMenuButton("soldButton", (post) => {
      if (
        post.user_id === currentUser.id &&
        topicRoute.currentModel.isClassifiedListing &&
        post.post_number === 1 &&
        (topicRoute.currentModel.listingStatus === LISTING_STATUSES.active ||
          topicRoute.currentModel.listingStatus === LISTING_STATUSES.pending)
      ) {
        return {
          action: "markSold",
          icon: "dollar-sign",
          className: "status-sold listing-status",
          title: "discourse_classifieds.post_buttons.status.sold.title",
          label: "discourse_classifieds.post_buttons.status.sold.label",
          position: "last",
        };
      }
    });

    api.addPostMenuButton("pendingButton", (post) => {
      if (
        post.user_id === currentUser.id &&
        topicRoute.currentModel.isClassifiedListing &&
        post.post_number === 1 &&
        topicRoute.currentModel.listingStatus === LISTING_STATUSES.active
      ) {
        return {
          action: "markPending",
          icon: "sync",
          className: "status-pending listing-status",
          title: "discourse_classifieds.post_buttons.status.pending.title",
          label: "discourse_classifieds.post_buttons.status.pending.label",
          position: "last",
        };
      }
    });

    api.addPostMenuButton("activeButton", (post) => {
      if (
        post.user_id === currentUser.id &&
        topicRoute.currentModel.isClassifiedListing &&
        post.post_number === 1 &&
        (topicRoute.currentModel.listingStatus === LISTING_STATUSES.sold ||
          topicRoute.currentModel.listingStatus === LISTING_STATUSES.pending)
      ) {
        return {
          action: "markActive",
          icon: "bullhorn",
          className: "status-active listing-status",
          title: "discourse_classifieds.post_buttons.status.active.title",
          label: "discourse_classifieds.post_buttons.status.active.label",
          position: "last",
        };
      }
    });

    // TODO: Find a way to refresh route rather than hard window reload:
    api.attachWidgetAction("post", "markSold", function () {
      const topicId = this.model.topic.id;

      ajax(`/t/-/${topicId}`, {
        type: "PUT",
        data: { listingStatus: LISTING_STATUSES.sold },
      })
        .then(() => window.location.reload())
        .catch(popupAjaxError);
    });

    api.attachWidgetAction("post", "markActive", function () {
      const topicId = this.model.topic.id;

      ajax(`/t/-/${topicId}`, {
        type: "PUT",
        data: { listingStatus: LISTING_STATUSES.active },
      })
        .then(() => window.location.reload())
        .catch(popupAjaxError);
    });

    api.attachWidgetAction("post", "markPending", function () {
      const topicId = this.model.topic.id;

      ajax(`/t/-/${topicId}`, {
        type: "PUT",
        data: { listingStatus: LISTING_STATUSES.pending },
      })
        .then(() => window.location.reload())
        .catch(popupAjaxError);
    });
  }
});
