from rest_framework.serializers import ModelSerializer, ChoiceField, CharField, \
    PrimaryKeyRelatedField, ImageField, Serializer, IntegerField
from .models import PetListing

class PetListingSerializer(ModelSerializer):
    class Meta:
        model = PetListing
        exclude = ['shelter']
        #maybe try to set an initial value for status
        

class SortFilterSerializer(Serializer):
    status = CharField(required=False)
    breed = CharField(required=False)
    age = IntegerField(required=False)


class SortFilterSerializer(ModelSerializer):
    # searchword = CharField()     removed this because including a word is too complex

    NAME = 'name'
    AGE = 'age'   
    ORDER_BY_CHOICES = (
        (NAME, "Name"),
        (AGE, "Age"),
    )
    ordering = ChoiceField(choices=ORDER_BY_CHOICES, required=False)
    name=CharField(read_only=True)
    image=ImageField(read_only=True)
    about=CharField(read_only=True)
    gender=CharField(read_only=True)
    size=CharField(read_only=True)

    # status=CharField(required=False, allow_null = True)
    # breed=CharField(required=False, allow_null = True)
    # age=CharField(required=False, allow_null = True)
    class Meta:
        model=PetListing
        # fields=['name', 'status', 'breed', 'age', 'sort_by']
        fields = '__all__'