Discourse::Application.routes.prepend do
  get '/classifieds' => 'classifieds#index'
end