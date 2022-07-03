# frozen_string_literal: true

module DiscourseClassifieds
  class ::ClassifiedsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    def index
      data = search(false)
      render json: data
    end

    def list
      raise Discourse::InvalidAccess.new unless current_user
      user = fetch_user

      data = search(user)

      render json: data
    end

    private

    def fetch_user
      user = User.find_by_username(params.require(:username))
      if user.blank?
        render json: {
          errors: [I18n.t("follow.user_not_found", username: params[:username].inspect)]
        }, status: 404
        return nil
      end
      user
    end

    def search(user)
      listing_topics = TopicCustomField.where(name: 'isClassifiedListing', value: 'true').pluck('topic_id')

      all_data = []

      if user
        topic_data = Topic.where(id: listing_topics, user_id: user.id)
      else
        topic_data = Topic.where(id: listing_topics)
      end

      topic_data.each do |topic|
        classified_fields = TopicCustomField.where(topic_id: topic.id)
        field_items = {}
        classified_fields.each do |field|
          field_items[field.name] = field.value
        end

        user = User.find_by(id: topic.user_id)

        topic_with_classified_fields = {
          **topic.attributes,
          **field_items,
          user: user,
          user_avatar: user.avatar_template()
        }

        all_data.push(topic_with_classified_fields)
      end

      all_data
    end
  end
end
