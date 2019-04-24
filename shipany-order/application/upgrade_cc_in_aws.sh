# Upgrade
set -e
 
if [ -z "$1" ]; then echo "Error: Needs chaincode version"; exit; fi
CHAINCODE_VERSION=$1
 
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode install -l node -n ordercontract -v ${CHAINCODE_VERSION} -p /opt/home/shipanychaincode/shipany-order/contract
 
sleep 5
 
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode upgrade -l node -n ordercontract -v ${CHAINCODE_VERSION} -C shipanychannel -c '{"Args":[]}' --cafile /opt/home/managedblockchain-tls-chain.pem --tls
