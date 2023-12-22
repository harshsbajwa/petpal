# PetPal Django REST API and React Frontend

This project uses a Django backend and React frontend for PetPal, an application that facilitates pet adoptions and shelter operations.

## Overview

The webpage is currently built with Bootstrap and React for the frontend and the Django Rest Framwork on the backend.

## Setup

- If you would like to run the code on your own server you can do so by running the startup.sh and the run.sh file. This should get you setup with the required packages and migrations aswell as start the server on your localhost 8000 port. You should also setup of the frontend by running npm install in the fronend folder then npm start. This will start the frontend react server on the localhost:3000 port.

## Key Details

- Implemented with Django backend and adheres to RESTful APIs.
- Comes provided a complete Django project with `startup.sh`, `run.sh`, `docs.pdf`.
- Ensured code functionality on Ubuntu 20.04.6 LTS Linux distribution.
- Made with react of the frontend.

### Files:
- `frontend`: directory containing required files for the frontend
- `backend`: directory containing required files for the backend
- `backend/startup.sh`: Prepares the environment, creates a virtual environment, installs required packages with pip, and runs migrations.
- `backend/run.sh`: Starts the server.
- `backend/docs.pdf`: Documentation including model design, API endpoints list, methods, payloads. Utilizes Swagger UI API documentation.

## Packages

Required Packages:
- React
- Bootstrap
- Django
- Python Imaging Library (pillow)
- Django REST framework
- Simple JWT for token-based authentication
- For additional documentation packages refer to startup.sh file.