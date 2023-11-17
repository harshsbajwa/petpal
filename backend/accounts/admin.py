from django.contrib import admin
from .models import User, Seeker, Shelter
# Register your models here.
admin.site.register(User)
admin.site.register(Seeker)
admin.site.register(Shelter)