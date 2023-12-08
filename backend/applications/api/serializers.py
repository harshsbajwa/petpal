from rest_framework.serializers import ModelSerializer
from applications.application import Application
from comments.serializers import ApplicationCommentSerializer
# from django.core.validators import validate_email
# from django.core.exceptions import ValidationError
# import re


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

    # def validate_form(self, data):
    #     if not data:
    #         raise ValidationError("Form data is required.")

    #     form_data = data.get('form', {})

    #     first_name = form_data.get('first_name')
    #     if not first_name:
    #         raise ValidationError({"form": {"first_name": "First name is required."}})
        
    #     last_name = form_data.get('first_name')
    #     if not last_name:
    #         raise ValidationError({"form": {"last_name": "Last name is required."}})

    #     email = form_data.get('email')
    #     if not email:
    #         raise ValidationError({"form": {"email": "Email is required."}})
    #     try:
    #         validate_email(email)
    #     except ValidationError:
    #         raise ValidationError({"form": {"email": "Invalid email format."}})

    #     phone = form_data.get('phone_number')
    #     if not phone:
    #         raise ValidationError({"form": {"phone_number": "Phone number is required."}})
    #     if not re.match(r'^\+?1?\d{9,15}$', phone):
    #         raise ValidationError({"form": {"phone_number": "Invalid phone number format."}})
        
    #     address = form_data.get('address')
    #     if not address:
    #         raise ValidationError({"form": {"address": "address is required."}})
        
    #     city = form_data.get('city')
    #     if not city:
    #         raise ValidationError({"form": {"city": "city is required."}})
        
    #     province = form_data.get('province')
    #     if not province:
    #         raise ValidationError({"form": {"province": "province is required."}})

    #     postal_code = data.get('postal_code')
    #     if not postal_code:
    #         raise ValidationError({"postal_code": "Postal code is required."})
    #     if not re.match(r'^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$', postal_code):
    #         raise ValidationError({"postal_code": "Invalid postal code format."})

    #     age = data.get('age')
    #     if age is None:
    #         raise ValidationError({"age": "Age is required."})
    #     if age < 18:
    #         raise ValidationError({"age": "Applicant must be at least 18 years old."})

    #     return data