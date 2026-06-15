from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:

        model = Product
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    class Meta:
        model = CartItem
        fields = '__all__'
    
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    class Meta:
        model = Cart
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = [ 'username', 'email', 'password','password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data
    
    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']

        user = User.objects.create_user(username=username,email=email,password=password)
        return user
       
class OrderHistorySerializer(serializers.ModelSerializer):
    # Dynamically maps your model's total_amount field to match the total_price fallback property
    total_price = serializers.CharField(source='total_amount', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'total_price', 'items_count']

    def get_items_count(self, obj):
        # Counts child records bound to this specific order instance
        # Safely defaults to 0 if the reverse relationship fails or matches nothing
        if hasattr(obj, 'items'):
            return obj.items.count()
        return 0