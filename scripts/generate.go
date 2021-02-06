// Copyright (c) The Tellor Authors.
// Licensed under the MIT License.

package main

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/nanmu42/etherscan-api"
	"github.com/tellor-io/telliot/pkg/bindings"
	"github.com/tellor-io/telliot/pkg/config"
)

func main() {
	log.SetFlags(log.Ltime | log.Lshortfile | log.Lmsgprefix)

	downlContractsFolder := filepath.Join("src", "contracts")

	// Bindings for the oracle proxy.
	downloadAndGenerate(config.TellorMainnetAddress, downlContractsFolder, "tellorMaster")
	time.Sleep(5 * time.Second)

	// Bindings for the oracle master.
	downloadAndGenerate("0xc5721b1b753b0e2129f88694762c718c36442e7c", downlContractsFolder, "tellorLatest")
	time.Sleep(5 * time.Second)

}
func downloadAndGenerate(addr, downlContractsFolder, name string) {
	downloadFolder := filepath.Join(downlContractsFolder, name)
	os.RemoveAll(downloadFolder)
	ExitOnErr(os.MkdirAll(downloadFolder, os.ModePerm), "create download folder")

	filePaths, err := bindings.DownloadContracts(etherscan.Mainnet, addr, downloadFolder, name)
	ExitOnErr(err, "download contracts")

	log.Printf("Downloaded contract:%+v", filePaths)
	_, abis, _, _, _, err := bindings.GetContractObjects(filePaths)
	ExitOnErr(err, "get contracts object")

	err = bindings.GenerateABI(downloadFolder, name, abis)
	ExitOnErr(err, "generate ABI")
	log.Println("Generated ABI:", filepath.Join(downloadFolder, name))

}

func ExitOnErr(err error, msg string) {
	if err != nil {
		log.Fatalf("execution error:%+v msg:%+v", err, msg)
	}
}
