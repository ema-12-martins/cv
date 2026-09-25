#!/bin/bash
# This script expects a container started with the following command.
sudo docker run -p 8983:8983 --name meic_solr -v ${PWD}:/data -d solr:9 solr-precreate songs
# sudo docker exec -it meic_solr curl "http://localhost:8983/solr/songs/update?commit=true" -H "Content-Type: text/xml" --data-binary '<delete><query>*:*</query></delete>'
sleep 10

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary "@./simple_schema.json" \
    http://localhost:8983/solr/songs/schema

# Populate collection using mapped path inside container.
sudo docker exec -it meic_solr bin/post -c songs /data/data/dataset_final_cleaned.json
