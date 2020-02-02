# Overwrite paths
PROJECT_ROOT = $(abspath $(CURDIR)/..)
SITE_ROOT = $(PROJECT_ROOT)/gql_products_service


# Include parent makefile
include ../Makefile


start:
	@ export FLASK_APP=products_service.application && \
	  export FLASK_ENV=development && \
	  flask run --port 3003

dump-requirements:
	@ poetry export --dev -f requirements.txt -o $(PROJECT_ROOT)/requirements/products.txt
