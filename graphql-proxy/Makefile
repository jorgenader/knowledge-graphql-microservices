# Overwrite paths
PROJECT_ROOT = $(abspath $(CURDIR)/..)
SITE_ROOT = $(PROJECT_ROOT)/graphql-proxy


# Include parent makefile
include ../Makefile


start-proxy:
	@ export WATCH_DIRECTORY=$(PROJECT_ROOT) && \
	  yarn start:dev
