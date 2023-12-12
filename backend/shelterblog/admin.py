from django.contrib import admin
from .models import ShelterBlog, ShelterBlogger, BlogPost


# Register your models here.
admin.site.register(ShelterBlogger)
admin.site.register(BlogPost)
admin.site.register(ShelterBlog)