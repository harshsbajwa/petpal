# PetPal Django REST API

This project aims to create a Django backend implementing a RESTful API for PetPal, an application that facilitates pet adoptions and shelter operations.

## Overview

The webpage is currently built with Bootstrap for the frontend and the Django Rest Framwork on the backend. The frontend will later be converted to React.

## Setup

- If you would like to run the code on your own server you can do so by running the startup.sh and the run.sh file. This should get you setup with the required packages and migrations aswell as start the server on your localhost port.

## Key Details

- Implemented with Django backend and adheres to RESTful APIs.
- Comes provided a complete Django project with `startup.sh`, `run.sh`, and `docs.pdf`.
- Ensured code functionality on Ubuntu 20.04.6 LTS Linux distribution.

### Files:
- `frontend`: directory containing required files for the frontend
- `backend`: directory containing required files for the backend
- `backend/startup.sh`: Prepares the environment, creates a virtual environment, installs required packages with pip, and runs migrations.
- `backend/run.sh`: Starts the server.
- `backend/docs.pdf`: Documentation including model design, API endpoints list, methods, payloads. Utilizes Swagger UI API documentation.

## Packages

Required Packages:
- Django
- Python Imaging Library (pillow)
- Django REST framework
- Simple JWT for token-based authentication
- For additional documentation packages refer to startup.sh file.
