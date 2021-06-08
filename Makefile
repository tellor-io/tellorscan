include .bingo/Variables.mk

.PHONY: generate
generate: $(CONTRAGET)
	@$(CONTRAGET) --addr=0x04b5129735b5d9b1b54109f2c4c06ea23b506a95 --download-dst=tmp --abi-dst=src/contracts --name=oracle