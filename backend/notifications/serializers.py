from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    comment = serializers.HyperlinkedRelatedField(
        view_name='comment-single', 
        read_only=True
    )
    
    application = serializers.HyperlinkedRelatedField(
        view_name='application', 
        read_only=True
    )

    class Meta:
        model = Notification
        fields = '__all__'

class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        # fields = ['is_read']
        fields = '__all__'