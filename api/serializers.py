from rest_framework import serializers
from .models import Category, Brand, Order, OrderItem, Product, ProductSpecification, Cart, CartItem, Review, Wishlist
from django.contrib.auth import get_user_model

class ProductSpecificationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="specification.name", read_only=True)

    class Meta:
        model = ProductSpecification
        fields = ['id', 'name', 'value']
        read_only_fields = ['id']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'image']
        read_only_fields = ['id','slug']


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","name","slug","image","price"]
        read_only_fields = ['id','slug']


class CategoryListSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ["id","name","slug","image"]
        read_only_fields = ['id','slug']    


class CategoryDetailSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)
    class Meta: 
        model = Category
        fields = ["id","name","image","slug","products"]
        read_only_fields = ['id','slug']


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategoryListSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'description', 
            'price', 
            'slug', 
            'image', 
            'featured', 
            'category', 
            'brand', 
            'specifications' 
        ]
        read_only_fields = ['id','slug']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id','product','quantity','sub_total']

    def get_sub_total(self, cartitem):
        total = cartitem.product.price * cartitem.quantity
        return total           


class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(read_only=True, many=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id','cart_code','cartitems','cart_total']

    def get_cart_total(self, cart):
        items = cart.cartitems.all()
        total = sum([item.quantity * item.product.price for item in items])
        return total

class CartStatSerializer(serializers.ModelSerializer):
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id','cart_code','cartitems','total_quantity']

    def get_total_quantity(self, cart):
        items = cart.cartitems.all()
        total = sum([item.quantity for item in items])
        return total


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'first_name', 'last_name', 'profile_picture_url']
        read_only_fields = ['id', 'username', 'email']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'review', 'created', 'updated']
        read_only_fields = ['id', 'user', 'created']


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'created']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name','quantity','price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 
            'order_code', 
            'total_amount', 
            'status', 
            'mercadopago_payment_id', 
            'shipping_address', 
            'created_at', 
            'items' 
        ]
