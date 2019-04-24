cd /Users/victor/00Victor/00Work/00Codes/go/src/fab/fabric-samples_v1.4.0/first-network

./byfn.sh down -y && docker rm -f $(docker ps -aq) || docker network prune -y

cd -

docker rm -f $(docker ps -aq) || docker rmi -f $(docker images | grep fabcar | awk '{print $3}')

docker rmi $(docker images | grep "dev-peer" | awk '{print $1}')

docker network prune

