# frozen_string_literal: true

module DiscourseClassifieds
  class ::ClassifiedsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    def index
      listingTopics = TopicCustomField.where(name: 'isClassifiedListing', value: 'true').pluck('topic_id')

      topicData = Topic.where(id: listingTopics)
      render json: topicData
    end
  end
end
