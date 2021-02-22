# Auto generated binary variables helper managed by https://github.com/bwplotka/bingo v0.3.1. DO NOT EDIT.
# All tools are designed to be build inside $GOBIN.
BINGO_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
GOPATH ?= $(shell go env GOPATH)
GOBIN  ?= $(firstword $(subst :, ,${GOPATH}))/bin
GO     ?= $(shell which go)

# Bellow generated variables ensure that every time a tool under each variable is invoked, the correct version
# will be used; reinstalling only if needed.
# For example for contraget variable:
#
# In your main Makefile (for non array binaries):
#
#include .bingo/Variables.mk # Assuming -dir was set to .bingo .
#
#command: $(CONTRAGET)
#	@echo "Running contraget"
#	@$(CONTRAGET) <flags/args..>
#
CONTRAGET := $(GOBIN)/contraget-v0.0.0-20210219062201-f13588db3979
$(CONTRAGET): $(BINGO_DIR)/contraget.mod
	@# Install binary/ries using Go 1.14+ build command. This is using bwplotka/bingo-controlled, separate go module with pinned dependencies.
	@echo "(re)installing $(GOBIN)/contraget-v0.0.0-20210219062201-f13588db3979"
	@cd $(BINGO_DIR) && $(GO) build -mod=mod -modfile=contraget.mod -o=$(GOBIN)/contraget-v0.0.0-20210219062201-f13588db3979 "github.com/cryptoriums/contraget/cmd/contraget"

