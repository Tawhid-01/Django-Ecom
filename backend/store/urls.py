from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', views.registerPage),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('products/', views.getProducts),
    path('products/<int:pk>/', views.getProduct),
    path('categories/', views.getCategories),
    path('cart/', views.getCart),
    path('cart/add/', views.addToCart),
    path('cart/remove/', views.removeFromCart),
    path('cart/update/', views.updateQuantity),
    path('orders/create/', views.createOrder),

    path('user/profile/', views.get_user_profile, name='user-profile'),
    path('orders/my-orders/', views.get_user_orders, name='my-orders'),

]
    