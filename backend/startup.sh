virtualenv venv
source venv/bin/activate

#django package installs
python -m pip install djangorestframework
python -m pip install djangorestframework-simplejwt
python -m pip install Pillow

#for viewing endpoints
python -m pip install pyyaml
python -m pip install uritemplate
python -m pip install django-rest-swagger
python -m pip install django-cors-headers

python manage.py makemigrations
python manage.py migrate
