include .bingo/Variables.mk

.PHONY: generate
generate: $(CONTRAGET)
	@$(CONTRAGET) --addr=0x1820f929272c2be486e709c6219ac07ded2845bc --download-dst=tmp --abi-dst=src/contracts --name=oracle