from rest_framework import serializers
from accounts.models import User, Seeker, Shelter


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=['username', 'email', 'is_shelter']

class SeekerRegisterSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={"input_type":"password"}, write_only=True)
    class Meta:
        model = User
        fields=['username', 'email', 'password', 'password2']
        extra_kwargs={
            'password':{'write_only':True}
        }
    def save(self, **kwargs):
        user = User(username=self.validated_data['username'],
                    email=self.validated_data['email']
                    )
        password=self.validated_data['password']
        password2=self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({"error":"password do not match"})
        user.set_password(password)
        user.is_seeker=True
        user.save()
        Seeker.objects.create(user=user)
        return user

class ShelterRegisterSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={"input_type":"password"}, write_only=True)
    class Meta:
        model = User
        fields=['username', 'email', 'password', 'password2']
        extra_kwargs={
            'password':{'write_only':True}
        }
    def save(self, **kwargs):
        user = User(username=self.validated_data['username'],
                    email=self.validated_data['email']
                    )
        password=self.validated_data['password']
        password2=self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({"error":"password do not match"})
        user.set_password(password)
        user.is_shelter=True
        user.save()
        Shelter.objects.create(user=user)
        return user


#below are serializers for updating a user
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class SeekerUpdateSerializer(serializers.ModelSerializer):
    user = UserUpdateSerializer()
    class Meta:
        model = Seeker
        fields = ['user', 'phone', 'location', 'preferences']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_instance = instance.user

        for attr, value in user_data.items():
            setattr(user_instance, attr, value)
        user_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
        
class ShelterUpdateSerializer(serializers.ModelSerializer):
    user = UserUpdateSerializer()
    class Meta:
        model = Shelter
        fields = ['user', 'shelter_name', 'phone', 'location', 'mission']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_instance = instance.user

        for attr, value in user_data.items():
            setattr(user_instance, attr, value)
        user_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    

#below is the serializers for viewing a Shelter Profile as any

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

class ShelterProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    class Meta:
        model = Shelter
        fields = ['user', 'id', 'shelter_name', 'phone', 'location', 'mission']


#below is the serializers for deleting a shelter or a seeker

class SeekerDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seeker
        fields = '__all__'

class ShelterDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = '__all__'