# frozen_string_literal: true

Discourse::Application.routes.prepend do
  get '/classifieds' => 'classifieds#index'
  get '/u/:username/activity/classifieds' => 'classifieds#list', constraints: { username: RouteFormat.username }
end
