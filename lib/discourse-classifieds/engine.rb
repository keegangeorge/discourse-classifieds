# frozen_string_literal: true

module ::DiscourseClassifieds
  PLUGIN_NAME ||= "discourse_classifieds"

  class Engine < ::Rails::Engine
    engine_name PLUGIN_NAME
    isolate_namespace DiscourseClassifieds
  end
end
