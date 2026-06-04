from django.urls import path

from . import views

urlpatterns = [
    path('products/', views.getProducts),
    path('products/<int:pk>/', views.getProduct),
    path('categories/', views.getCategories),
    path('cart/', views.getCart),
    path('cart/add/', views.addToCart),
    path('cart/remove/', views.removeFromCart),

]
    