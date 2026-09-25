#................4.0.........................
docker stop meic_solr
docker rm meic_solr
docker-compose -f docker/docker-compose.yml up -d

#................4.1.........................
make up
make schema
make populate
make down
# ................4.2.........................

#Things that we need
pip install matplotlib numpy pandas scikit-learn pytrec_eval==0.5

# Some permitions
chmod +x ./scripts/query_solr.py
chmod +x ./scripts/solr2trec.py
chmod +x ./scripts/qrels2trec.py
chmod +x ./scripts/plot_pr.py

dos2unix ./scripts/*.py

# ................4.3.........................

# Solr JSON results can be converted to TREC format using solr2trec.py and redirected to a file as shown next
./scripts/query_solr.py --query config/query_sys1.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > results_sys1_trec.txt

# ................4.4.........................

# Download the trec_eval repository into the src/ directory and compile it
make trec_eval

# qrels are converted into the correct TREC format using the qrels2trec.py scripts
cat config/qrels.txt | ./scripts/qrels2trec.py > qrels_trec.txt

# Use trec_eval
src/trec_eval/trec_eval qrels_trec.txt results_sys1_trec.txt

# ................4.5.........................

# Use the plot_pr.py script to generate a PNG plot of the Precision-Recall curve
cat results_sys1_trec.txt | ./scripts/plot_pr.py --qrels qrels_trec.txt --output images/prec_rec_sys1.png