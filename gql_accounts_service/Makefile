# Overwrite paths
PROJECT_ROOT = $(abspath $(CURDIR)/..)
SITE_ROOT = $(PROJECT_ROOT)/gql_accounts_service

# Include parent makefile
include ../Makefile


dump-requirements:
	poetry export --dev -f requirements.txt -o ../requirements/accounts.txt
