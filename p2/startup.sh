virtualenv venv
source venv/bin/activate
#need to install pillow, rest and jwt
pip3 install djangorestframework
pip3 install djangorestframework-simplejwt
python -m pip install Pillow
python manage.py makemigrations
python manage.py migrate

