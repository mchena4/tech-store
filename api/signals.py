from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg

from .models import ProductRating, Review

def update_product_rating(instance):
    product = instance.product
    reviews = product.reviews.all()
    total_reviews = reviews.count()

    if total_reviews > 0:
        average_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    else:
        average_rating = 0.0

    product_rating, created = ProductRating.objects.get_or_create(product=product)
    product_rating.average_rating = average_rating
    product_rating.total_reviews = total_reviews
    product_rating.save()


# Signal to update product rating when a review is saved
@receiver(post_save, sender=Review)
def update_product_rating_on_save(sender, instance, **kwargs):
    update_product_rating(instance)

# Signal to update product rating when a review is deleted
@receiver(post_delete, sender=Review)
def update_product_rating_on_delete(sender, instance, **kwargs):
    update_product_rating(instance)