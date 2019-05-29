Rails.application.routes.draw do
  resources :users
  resources :tasks

  match 'tasks', to: 'tasks#destroy_all', via: :delete 
  root 'tasks#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
