
# QUERY 1 ......................................................................................................................

./scripts/query_solr.py --query config/improved/queries/query_sys1.json --uri http://localhost:8983/solr --collection songs > config/improved/results/result_sys1.json

./scripts/query_solr.py --query config/improved/queries/query_sys1.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > config/improved/results/results_sys1_trec.txt

cat config/improved/qrels/qrels1.txt | ./scripts/qrels2trec.py > config/improved/qrels/qrels_trec1.txt

src/trec_eval/trec_eval config/improved/qrels/qrels_trec1.txt config/improved/results/results_sys1_trec.txt

cat config/improved/results/results_sys1_trec.txt | ./scripts/plot_pr.py --qrels config/improved/qrels/qrels_trec1.txt --output config/improved/images/prec_rec_sys1.png

# QUERY 2 ......................................................................................................................

./scripts/query_solr.py --query config/improved/queries/query_sys2.json --uri http://localhost:8983/solr --collection songs > config/improved/results/result_sys2.json

./scripts/query_solr.py --query config/improved/queries/query_sys2.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > config/improved/results/results_sys2_trec.txt

cat config/improved/qrels/qrels2.txt | ./scripts/qrels2trec.py > config/improved/qrels/qrels_trec2.txt

src/trec_eval/trec_eval config/improved/qrels/qrels_trec2.txt config/improved/results/results_sys2_trec.txt

cat config/improved/results/results_sys2_trec.txt | ./scripts/plot_pr.py --qrels config/improved/qrels/qrels_trec2.txt --output config/improved/images/prec_rec_sys2.png

# QUERY 3 ......................................................................................................................

./scripts/query_solr.py --query config/improved/queries/query_sys3.json --uri http://localhost:8983/solr --collection songs > config/improved/results/result_sys3.json

./scripts/query_solr.py --query config/improved/queries/query_sys3.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > config/improved/results/results_sys3_trec.txt

cat config/improved/qrels/qrels3.txt | ./scripts/qrels2trec.py > config/improved/qrels/qrels_trec3.txt

src/trec_eval/trec_eval config/improved/qrels/qrels_trec3.txt config/improved/results/results_sys3_trec.txt

cat config/improved/results/results_sys3_trec.txt | ./scripts/plot_pr.py --qrels config/improved/qrels/qrels_trec3.txt --output config/improved/images/prec_rec_sys3.png

# QUERY 4 ......................................................................................................................

./scripts/query_solr.py --query config/improved/queries/query_sys4.json --uri http://localhost:8983/solr --collection songs > config/improved/results/result_sys4.json

./scripts/query_solr.py --query config/improved/queries/query_sys4.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > config/improved/results/results_sys4_trec.txt

cat config/improved/qrels/qrels4.txt | ./scripts/qrels2trec.py > config/improved/qrels/qrels_trec4.txt

src/trec_eval/trec_eval config/improved/qrels/qrels_trec4.txt config/improved/results/results_sys4_trec.txt

cat config/improved/results/results_sys4_trec.txt | ./scripts/plot_pr.py --qrels config/improved/qrels/qrels_trec4.txt --output config/improved/images/prec_rec_sys4.png

# QUERY 5 ......................................................................................................................

./scripts/query_solr.py --query config/improved/queries/query_sys5.json --uri http://localhost:8983/solr --collection songs > config/improved/results/result_sys5.json

./scripts/query_solr.py --query config/improved/queries/query_sys5.json --uri http://localhost:8983/solr --collection songs | \
./scripts/solr2trec.py > config/improved/results/results_sys5_trec.txt

cat config/improved/qrels/qrels5.txt | ./scripts/qrels2trec.py > config/improved/qrels/qrels_trec5.txt

src/trec_eval/trec_eval config/improved/qrels/qrels_trec5.txt config/improved/results/results_sys5_trec.txt

cat config/improved/results/results_sys5_trec.txt | ./scripts/plot_pr.py --qrels config/improved/qrels/qrels_trec5.txt --output config/improved/images/prec_rec_sys5.png
