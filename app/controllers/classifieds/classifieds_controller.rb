# frozen_string_literal: true

module DiscourseClassifieds
  class ::ClassifiedsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    def index
      listing_topics = TopicCustomField.where(name: 'isClassifiedListing', value: 'true').pluck('topic_id')

      all_data = []

      topic_data = Topic.where(id: listing_topics)
      topic_data.each do |topic|
        classified_fields = TopicCustomField.where(topic_id: topic.id)
        field_items = {}
        classified_fields.each do |field|
          field_items[field.name] = field.value
        end

        topic_with_classified_fields = {
          **topic.attributes,
          **field_items
        }

        all_data.push(topic_with_classified_fields)
      end

      render json: all_data
    end
  end
end
