# Start Solr server with the current folder mapped to the container (at /data) and pre-create a core.
sudo docker run -p 8983:8983 --name meic_solr -v ${PWD}:/data -d solr:9.4 solr-precreate semantic_songs

sleep 10

# Add the schema defined at semantic_schema.json
sudo curl -X POST -H 'Content-type:application/json' \
--data-binary "@./data/data/semantic_schema.json" \
http://localhost:8983/solr/semantic_songs/schema

# Index the JSON documents.
sudo curl -X POST -H 'Content-type:application/json' \
--data-binary "@./data/data/semantic_songs.json" \
http://localhost:8983/solr/semantic_songs/update?commit=true

