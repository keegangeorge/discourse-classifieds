# frozen_string_literal: true

# name: discourse-classifieds
# about: Adds a classifieds section to your Discourse instance
# version: 0.0.1
# authors: Keegan George
# url: https://github.com/keegangeorge/discourse-classifieds
# required_version: 2.7.0
# transpile_js: true

# Assets
register_asset "stylesheets/common/common.scss"
register_asset "stylesheets/mobile/mobile.scss", :mobile

icons = ["fa-ad", "fa-map-marker-alt", "fa-bullhorn", "fa-sync", "fa-dollar-sign", "fa-store"]
icons.each { |icon| register_svg_icon icon } if respond_to?(:register_svg_icon)

enabled_site_setting :discourse_classifieds_enabled

after_initialize do
  fields = [
  { name: 'isClassifiedListing', type: 'boolean' },
  { name: 'listingStatus', type: 'string' },
  { name: "listingDetails", type: 'json' }
]
  # Custom Field Registration
  fields.each do |field|
    # Register the fields
    register_topic_custom_field_type(field[:name], field[:type].to_sym)

    # Getter Methods
    add_to_class(:topic, field[:name].to_sym) do
      if !custom_fields[field[:name]].nil?
        custom_fields[field[:name]]
      else
        nil
      end
    end

    # Setter Methods
    add_to_class(:topic, "#{field[:name]}=") do |value|
      custom_fields[field[:name]] = value
    end

    # Update on Topic Creation
    on(:topic_created) do |topic, opts, user|
      topic.send("#{field[:name]}=".to_sym, opts[field[:name].to_sym])
      topic.save!
    end

    # Update on Topic Edit
    PostRevisor.track_topic_field(field[:name].to_sym) do |tc, value|
      tc.record_change(field[:name], tc.topic.send(field[:name]), value)
      tc.topic.send("#{field[:name]}=".to_sym, value.present? ? value : nil)
    end

    # Serialize to Topic
    add_to_serializer(:topic_view, field[:name].to_sym) do
      object.topic.send(field[:name])
    end

    # Preload the Fields
    add_preloaded_topic_list_custom_field(field[:name])

    # Serialize to the topic list
    add_to_serializer(:topic_list_item, field[:name].to_sym) do
      object.send(field[:name])
    end
  end

  # Load Plugin Files
  %w[
    ../lib/discourse-classifieds/engine.rb
    ../config/routes.rb
    ../app/controllers/classifieds/classifieds_controller.rb
  ].each do |key|
    load File.expand_path(key, __FILE__)
  end

  # Add Topic Filters
  TopicQuery.add_custom_filter(:isClassifiedListing) do |topics, query|
    if query.options[:isClassifiedListing]
      topics.where("topics.id in (
      SELECT topic_id FROM topic_custom_fields
      WHERE (name = 'isClassifiedListing')
      AND value = '#{query.options[:isClassifiedListing]}'
    )")
    else
      topics
    end
  end

  TopicQuery.add_custom_filter(:listingStatus) do |topics, query|
    if query.options[:listingStatus]
      topics.where("topics.id in (
    SELECT topic_id FROM topic_custom_fields
    WHERE (name = 'listingStatus')
    AND value = '#{query.options[:listingStatus]}'
  )")
    else
      topics
    end
  end

end
