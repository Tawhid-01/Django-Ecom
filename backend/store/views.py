from django.shortcuts import render,redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from rest_framework import status
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
@permission_classes([IsAuthenticated])
def getCart(req):
    cart,created = Cart.objects.get_or_create(user=req.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addToCart(req):
    product_id = req.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=req.user)
    item, created = CartItem.objects.get_or_create(cart=cart,product=product)

    if not created:
        item.quantity += 1
        item.save()

    return Response({'message':'Item added to cart',"cart":CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def removeFromCart(req):
    item_id = req.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message':'Item removed from cart'})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(req):
    try:
        data = req.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone', '')
        payment_method = data.get('payment_method', 'COD')

        # 1. FIXED PHONE VALIDATION LOGIC
        # Old logic: if phone.isdigit() -> This rejected numbers because they WERE digits!
        # We want to throw an error if it is NOT digits (ignoring the leading plus sign)
        clean_phone = phone.replace('+', '')
        if not clean_phone.isdigit() or len(clean_phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)
        
        # Get user's cart
        cart, created = Cart.objects.get_or_create(user=req.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
            
        total = sum(item.product.price * item.quantity for item in cart.items.all())

        # 2. FIXED VARIABLE CASING (Changed 'Order' to 'new_order')
        new_order = Order.objects.create(
            user=req.user,
            total_amount=total,
            # Note: You should probably save name, address, and phone to your Order model here too!
            # name=name, address=address, phone=phone, payment_method=payment_method
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=new_order, # 👈 Updated reference
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear cart items safely
        cart.items.all().delete()
        
        return Response({
            'message': 'Order created successfully',
            "order_id": new_order.id # 👈 Updated reference
        })

    except Exception as e:
        return Response({'error': str(e)}, status=400)
@api_view(['POST'])
@permission_classes([AllowAny])
def registerPage(req):
    serializer = RegisterSerializer(data=req.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message':'User created successfully',"user":UserSerializer(user).data},status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Returns the account profile profile matrix of the authenticated user token context.
    """
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """
    Bulletproof view that safely inspects the Order model fields dynamically
    """
    try:
        # Fetch the orders for the logged-in user
        orders = Order.objects.filter(user=request.user).order_by('-id')
        
        data = []
        for order in orders:
            # 1. DYNAMIC PRICE FIELD CHECK
            # Safely searches your model for total_amount, total_price, or total
            price = 0
            for field in ['total_amount', 'total_price', 'total']:
                if hasattr(order, field):
                    price = getattr(order, field)
                    break

            # 2. DYNAMIC DATE FIELD CHECK
            # Safely searches your model for created_at, date_order, or similar
            date_val = None
            for field in ['created_at', 'date_ordered', 'date_created', 'date']:
                if hasattr(order, field):
                    date_val = getattr(order, field)
                    break

            # 3. DYNAMIC ITEM COUNT CHECK
            # Safely counts items from the order reverse relationship without crashing
            item_count = 0
            if hasattr(order, 'items'):
                item_count = order.items.count()
            elif hasattr(order, 'orderitem_set'):
                item_count = order.orderitem_set.count()
            elif hasattr(order, 'order_items'):
                item_count = order.order_items.count()

            data.append({
                "id": order.id,
                "created_at": date_val,
                "status": getattr(order, 'status', 'Pending'),
                "total_price": str(price),
                "items_count": item_count
            })
            
        return Response(data, status=200)
        
    except Exception as e:
        return Response({
            'error': 'Database mapping fallback error',
            'details': str(e)
        }, status=400)