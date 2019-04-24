#!/bin/bash
#
# Exit on first error
set -e

if [ -z "$1" ]; then echo "Error: Needs chaincode version"; exit; fi
CHAINCODE_VERSION=$1

docker exec cliMagnetoCorp peer chaincode install -l node -n ordercontract -v ${CHAINCODE_VERSION} -p /opt/gopath/src/github.com/contract

sleep 5

docker exec cliMagnetoCorp peer chaincode upgrade -l node -n ordercontract -v ${CHAINCODE_VERSION} -C mychannel -c '{"Args":[]}' -P "AND ('Org1MSP.member')"

