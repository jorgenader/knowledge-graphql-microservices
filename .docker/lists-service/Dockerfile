# Development Dockerfile for Django app
FROM python:3.8-slim

ENV PYTHONUNBUFFERED 0
ENV FLASK_APP lists_service.application
ENV FLASK_ENV development

# Expose our application port
EXPOSE 80

# Copy wait-for-it.sh script
COPY ./wait-for-it.sh /usr/bin/

# Install libpq-dev and gettext
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends gcc gettext libpq-dev git && \
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements dir and Install requirements
RUN pip install -U "poetry==1.*"

COPY pyproject.toml /
COPY poetry.lock /

# Install all dependencies from Pipfile.lock file
RUN poetry install

# Remove not needed system deps
RUN apt-get remove gcc git

# Set the default directory where CMD will execute
WORKDIR /app

# Run Flask's runserver by default
CMD flask run --port 80
