# frozen_string_literal: true

# name: discourse-classifieds
# about: Adds a classifieds section to your Discourse instance
# version: 0.0.1
# authors: Keegan George
# url: https://github.com/keegangeorge/discourse-classifieds
# required_version: 2.7.0
# transpile_js: true

# Assets
register_svg_icon "fa-ad"

enabled_site_setting :discourse_classifieds_enabled

after_initialize do
  %w[
    ../lib/discourse-classifieds/engine.rb
    ../config/routes.rb
    ../app/controllers/classifieds/classifieds_controller.rb
  ].each do |key|
    load File.expand_path(key, __FILE__)
  end
end
