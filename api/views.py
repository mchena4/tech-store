from django.db import IntegrityError
from django.db.models import Q
from django.shortcuts import render
from django.contrib.auth import get_user_model
import mercadopago
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.utils import send_order_confirmation_mail
from .models import Order, OrderItem, Product, Category, Cart, CartItem, Review, Wishlist
from .serializers import (OrderSerializer, ProductListSerializer, 
                          ProductDetailSerializer, 
                          CategoryListSerializer, 
                          CategoryDetailSerializer, 
                          CartSerializer,
                          CartItemSerializer,
                          ReviewSerializer, WishlistSerializer
                        )
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.conf import settings
from django.db import transaction

user_model = get_user_model()

# Create your views here.
@api_view(["GET"])
def product_list(request):
    # Homepage view to list all featured products
    products = Product.objects.filter(featured=True)
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def product_detail(request, slug):
    # Product detail view to show product details based on slug
    queryset = Product.objects.select_related("category","brand").prefetch_related("specifications")
    product = get_object_or_404(queryset, slug=slug)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def category_list(request):
    # View to list all categories
    categories = Category.objects.all()
    serializer = CategoryListSerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def category_detail(request, slug):
    # View to show category details and its products based on slug
    queryset = Category.objects.prefetch_related('products')
    category = get_object_or_404(queryset, slug=slug)
    serializer = CategoryDetailSerializer(category)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def add_to_cart(request):
    # View to add a product to the cart
    cart_code = request.data.get("cart_code")
    product_id = request.data.get("product_id")

    if cart_code is None or product_id is None:
        return Response({"error": "cart_code and product_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Create or get the cart and product
    cart, created = Cart.objects.get_or_create(cart_code=cart_code)
    product = get_object_or_404(Product, id=product_id)

    # Create or get the cart item based on the product and cart
    cartitem, created = CartItem.objects.get_or_create(product=product, cart=cart)
    if not created:
        cartitem.quantity += 1
    else:
        cartitem.quantity = 1 

    cartitem.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_cartitem(request, pk):
    try:
        cartitem = get_object_or_404(CartItem, pk=pk)
        cartitem.delete()
        return Response({"message": "Cart item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def update_cartitem_quantity(request):
    # View to update the quantity of a cart item
    cartitem_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    if cartitem_id is None or quantity is None:
        return Response({"error": "item_id and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate that quantity is an integer and greater than 0
    try:
        quantity = int(quantity)
    except ValueError:
        return Response({"error": "Quantity must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

    if quantity < 1:
        return Response({"error": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the cart item and update its quantity
    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    cartitem.quantity = quantity
    cartitem.save()

    serializer = CartItemSerializer(cartitem)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request):

    # Get fields from request data
    product_id = request.data.get("product_id")
    rating = request.data.get("rating")
    review_text = request.data.get("review")

    if not all([product_id, rating, review_text]):
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Get the product and user 
    product = get_object_or_404(Product, id=product_id)
    user = request.user

    # Check if the user has already left a review for this product
    try:
        review = Review.objects.create(product=product, user=user, rating=rating, review=review_text)
    except IntegrityError:
        return Response(
            {"error": "Ya has dejado una reseña para este producto."}, 
            status=status.HTTP_409_CONFLICT
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_review(request, pk):
    review = get_object_or_404(Review, pk=pk)
        
    # Check if the user is the owner of the review
    if review.user != request.user:
        return Response({"error": "You are not the owner of this review."}, status=status.HTTP_403_FORBIDDEN)

    # Update the review with the new data through the serializer
    serializer = ReviewSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_review(request, pk):
    # View to delete a review 
    review = get_object_or_404(Review, pk=pk)

    # Check if the user is the owner of the review
    if review.user != request.user:
        return Response({"error": "You are not the owner of this review."}, status=status.HTTP_403_FORBIDDEN)

    # Delete the review and handle any exceptions
    try:
        review.delete()
        return Response({"message": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get("product_id")
    user = request.user

    if not product_id:
        return Response({"error": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = get_object_or_404(Product, id=product_id)
        # Try to find an existing wishlist item for the user and product
        wishlist_item = Wishlist.objects.filter(user=user, product=product)
        if wishlist_item:
            # Remove product from wishlist
            wishlist_item.delete()
            return Response({"message": "Product removed from wishlist."}, status=status.HTTP_204_NO_CONTENT)

        # If product is not in wishlist, add it
        new_wishlist_item = Wishlist.objects.create(user=user, product=product)
        serializer = WishlistSerializer(new_wishlist_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
def product_search(request):
    query = request.query_params.get("query")
    if not query:
        return Response("No query provided", status=status.HTTP_400_BAD_REQUEST)

    try:
        products = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query) | Q(category__name__icontains=query))
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_mercadopago_preference(request):
    cart_code = request.data.get("cart_code")

    if not cart_code:
        return Response({"error": "cart_code is required."}, status=status.HTTP_400_BAD_REQUEST)

    cart = get_object_or_404(Cart.objects.prefetch_related('cartitems__product'), cart_code=cart_code)

    cart.user = request.user
    cart.save()

    cart_items = cart.cartitems.all()

    if not cart_items.exists():
        return Response({"error": "The cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

    items_data = []
    for item in cart_items:
        items_data.append({
            "title": item.product.name,
            "quantity": item.quantity,
            "unit_price": float(item.product.price),
            "currency_id": "ARS"
        })

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    preference_data = {
            "items": items_data,
            "back_urls": {
                "success": f"{settings.REDIRECT_URL}/pago-exitoso",
                "failure": f"{settings.REDIRECT_URL}/pago-fallido",
                "pending": f"{settings.REDIRECT_URL}/pago-pendiente"
            },
            "auto_return": "approved",
            "external_reference": cart.cart_code,
            "notification_url": f"{settings.REDIRECT_URL}/webhook/mercadopago/", 
        }
    try:
        preference_response = sdk.preference().create(preference_data)
        
        if preference_response.get("status") >= 400:
            return Response(preference_response["response"], status=status.HTTP_400_BAD_REQUEST)
        
        preference = preference_response["response"]
        
        return Response({
            "preference_id": preference["id"],
            "init_point": preference["init_point"]
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def mercadopago_webhook(request):
    
    action_type = request.data.get("type") or request.query_params.get("topic") or request.query_params.get("type")
    
    payment_id = request.data.get("data", {}).get("id") or request.query_params.get("data.id") or request.query_params.get("id")
        
    if action_type == "payment" and payment_id:
        sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
        payment_info = sdk.payment().get(payment_id)
        
        if payment_info["status"] == 200:
            payment = payment_info["response"]
            
            payment_status = payment.get("status")
            cart_code = payment.get("external_reference")
            
            if payment_status == "approved":
                if not Order.objects.filter(mercadopago_payment_id=payment_id).exists():
                    with transaction.atomic():
                        try:
                            cart = Cart.objects.get(cart_code=cart_code)
                            cart_items = cart.cartitems.all()
                            total = sum([item.quantity * item.product.price for item in cart_items])
                            
                            order = Order.objects.create(
                                user=cart.user,
                                order_code=cart_code,
                                total_amount=total,
                                status='Paid',
                                mercadopago_payment_id=payment_id
                            )
                            
                            for item in cart_items:
                                OrderItem.objects.create(
                                    order=order,
                                    product=item.product,
                                    quantity=item.quantity,
                                    price=item.product.price
                                )
                            
                            cart.delete()
                            send_order_confirmation_mail(order)
                            
                        except Cart.DoesNotExist:
                            return Response({"message": f"ERROR: The cart with the code: '{cart_code}' does not exist in the database."}, status=status.HTTP_404_NOT_FOUND)
                        except Exception as e:
                            return Response({"message": f"ERROR creating the order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    return Response({"message": "IGNORED: An order with this payment ID already exists."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": f"IGNORED: Payment status is not 'approved'. Is '{payment_status}'"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ERROR: The payment could not be queried via the Mercado Pago API."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message": "IGNORED: It is not a payment event or the ID is missing."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Notification received"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_order_history(request):
    try:
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
