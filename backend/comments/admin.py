from django.contrib import admin
from .models import Comment, ApplicationComment
# from applications.application import Application

# Register your models here.
admin.site.register(Comment)
admin.site.register(ApplicationComment)
# admin.site.register(Application)