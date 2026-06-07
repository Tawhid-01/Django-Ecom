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
def updateQuantity(req):
    item_id = req.data.get('item_id')
    quantity = req.data.get('quantity')
    if item_id is None or quantity is None:
        return Response({'error':'Item id and quantity are required'},status=400)
    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()
            return Response({'error':'Quantity must be at least 1'},status=400)
        item.quantity = quantity    
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error':'Item not found'},status=404)
    

@api_view(['POST'])
def removeFromCart(req):
    item_id = req.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message':'Item removed from cart'})
    
@api_view(['POST'])
def createOrder(req):
    try:
        data = req.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        pyment_method = data.get('payment_method','COD')

        cart = Cart.objects.first()

        if not cart or not cart.items.exists():
            return Response({'error':'Cart is empty'},status=400)

        total = sum (float(item.product.price) * item.quantity for item in cart.items.all())

        order = Order.objects.create(
            user=None,
            total=total
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        #Clear the cart
        cart.items.all().delete()
        return Response({'message':'Order created successfully',
        "order_id":order.id
        })
    
    except Exception as e:
        return Response({'error':str(e)},status=400)