from django.db import models
from accounts.models import Shelter, User


### def user_directory_path(instance, filename):
###      # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
###      return 'user_{0}/{1}'.format(instance.user.id, filename)


class ShelterBlog(models.Model):
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class ShelterBlogger(models.Model):
    blog = models.ForeignKey(ShelterBlog, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_pic = models.ImageField(blank=True)

    def __str__(self):
        return self.user.username


class BlogPost(models.Model):
    class Categories(models.TextChoices):
        LOREM = 'Lorem'
        IPSUM = 'Ipsum'
        DOLER = 'Doler'
        SIT = 'Sit'
        AMET = 'Amet'

    parent = models.ForeignKey(ShelterBlog, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_on = models.DateTimeField(auto_now=True, null=True)
    title = models.CharField(max_length=100, null=True)
    text = models.CharField(max_length=5000, null=True)
    cover_image = models.ImageField(upload_to='media/', null=True)
    file = models.FileField(upload_to='media/')
    category = models.CharField(max_length=15, choices=Categories.choices, default=Categories.LOREM)
    views = models.IntegerField(default=0, null=True)