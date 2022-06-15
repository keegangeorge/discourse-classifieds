# frozen_string_literal: true

module DiscourseClassifieds
  class ::ClassifiedsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    def index
      category = SiteSetting.classifieds_category;
      topics = Topic.where(category: category)
      render json: topics
    end
  end
end
