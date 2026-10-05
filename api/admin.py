from django.contrib import admin
from .models import Category, CustomUser, Order, OrderItem, Product, Brand, ProductRating, ProductSpecification, Review, Specification, Cart, CartItem, Wishlist
from django.contrib.auth.admin import UserAdmin
# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "first_name","last_name")
admin.site.register(CustomUser, CustomUserAdmin)

class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
admin.site.register(Brand, BrandAdmin)

class SpecificationAdmin(admin.ModelAdmin):
    list_display = ("name",)
admin.site.register(Specification, SpecificationAdmin)


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1 

class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "brand", "featured") 
    list_filter = ("category", "brand", "featured") 
    search_fields = ("name",) 

    inlines = [ProductSpecificationInline]
admin.site.register(Product, ProductAdmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name","slug")
admin.site.register(Category, CategoryAdmin)

admin.site.register([Cart,CartItem, Review, ProductRating, Wishlist, Order, OrderItem])