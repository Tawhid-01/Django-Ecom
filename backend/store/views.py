from django.shortcuts import render,redirect

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *

# Create your views here.

@api_view(['GET'])
def getProducts(req):
    products = Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(req,pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product,context={'request':req})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error':'Product not found'} , status=404)

@api_view(['GET'])
def getCategories(req):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCart(req):
    cart,created = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
def addToCart(req):
    product_id = req.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=None)
    item, created = CartItem.objects.get_or_create(cart=cart,product=product)

    if not created:
        item.quantity += 1
        item.save()

    return Response({'message':'Item added to cart',"cart":CartSerializer(cart).data})

@api_view(['POST'])
def removeFromCart(req):
    item_id = req.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message':'Item removed from cart'})
    
