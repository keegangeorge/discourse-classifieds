# frozen_string_literal: true

Discourse::Application.routes.prepend do
  get '/classifieds' => 'classifieds#index'
end
