# Overwrite paths
PROJECT_ROOT = $(abspath $(CURDIR)/..)
SITE_ROOT = $(PROJECT_ROOT)/gql_lists_service


# Include parent makefile
include ../Makefile


start-list-service:
	@ export FLASK_APP=lists_service.application && \
	  export FLASK_ENV=development && \
	  flask run --port 3002

dump-requirements:
	@ poetry export --dev -f requirements.txt -o $(PROJECT_ROOT)/requirements/lists.txt
