import { acceptance, exists } from "discourse/tests/helpers/qunit-helpers";
import { clearPopupMenuOptionsCallback } from "discourse/controllers/composer";
import selectKit from "discourse/tests/helpers/select-kit-helper";
import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
/*
Needs to have siteSettings.discourse_classifieds_enabled
Needs to be either: creating a new topic OR editing the first post of a topic
return classifiedsEnabled && (creatingTopic || (editing && firstPost));
*
*/
acceptance("Classifieds Builder - classifieds are enabled", function (needs) {
  needs.user();
  needs.settings({
    discourse_classifieds_enabled: true,
  });
  needs.hooks.beforeEach(() => clearPopupMenuOptionsCallback());

  test("create a topic", async function (assert) {
    await visit("/");
    await click("#create-topic");
    await click(".d-editor-button-bar .options");
    await selectKit(".toolbar-popup-menu-options").expand();

    assert.ok(
      exists(".select-kit-row[data-value='showClassifiedsBuilder']"),
      "it shows the builder button"
    );
  });

  // TODO
  test("edit a topic", async function (assert) {
    await visit("/t/topic_with_classified_listing");
    await click("#post_1 .widget-button.edit");
    await click(".d-editor-button-bar .options");
    await selectKit(".toolbar-popup-menu-options").expand();

    assert.ok(
      exists(".select-kit-row[data-value='showClassifiedsBuilder']"),
      "it shows the builder button"
    );
  });
});
