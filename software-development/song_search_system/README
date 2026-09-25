# A Year To Listen — Song Search System

A song search system developed as an academic project, indexing and enabling queries over a large collection of songs, combining data gathered from Kaggle and Last.FM.

## Authors
- João Fernandes — up202108044
- João Alves — up202108670
- Igor Andrade — up202108674
- Ema Martins — up202402794

## Overview

The project is divided into four main stages:

1. **Data Indexing** — collection, preparation and characterization of the data, followed by document indexing.
2. **Data Retrieval** — definition of search parameters (query, boosts, phrase slop, etc.).
3. **Data Evaluation** — assessment of results using information retrieval metrics.
4. **Queries** — tests with concrete queries, comparing two indexing schemas.

## Data

Data was collected from:
- **Kaggle**
- **Last.FM**

Each document (song) includes: title, artist, features, view count and a tag; from Last.FM, playcount, number of distinct listeners, and textual content (about the song and the artist) are also included. Long textual fields such as lyrics and content are particularly relevant for search.

## Indexing Schemas

Two schemas were defined:

- **Simple** — no tokenizers or filters.
- **Advanced** — with a text analysis pipeline, including:
  - `StandardTokenizerFactory` — splits text into words/expressions.
  - `ASCIIFoldingFilterFactory` — converts non-ASCII characters to their ASCII equivalent.
  - `LowerCaseFilterFactory` — normalizes text to lowercase.
  - `PortugueseStemFilterFactory` — reduces Portuguese words to their root form (e.g. `casinha` → `cas`).
  - `SynonymGraphFilterFactory` — expands tokens with synonyms defined in `synonyms.txt`.
  - `FlattenGraphFilterFactory` — simplifies the resulting token graphs into a linear sequence.

### Indexed Fields (Advanced schema)

| Field | Type | Indexed? |
|---|---|---|
| lyrics | boostedText | yes |
| title | boostedText | yes |
| views | Int | no |
| artist | shortText | yes |
| tag | string | yes |
| features | shortText | yes |
| lastfm_different_listeners | Int | no |
| lastfm_playcount | Int | no |
| lastfm_tags | string | yes |
| lastfm_content_song | boostedText | yes |
| lastfm_content_artist | boostedText | yes |
| lastfm_image_artist | string | no |
| lastfm_image_album | string | no |
| album | string | yes |

## Retrieval

Common query parameters and boosts applied in the advanced schema:

- `q.op = AND`
- `fl = *, score`
- `qf = lyrics^4 title^2 lastfm_content_artist^3 tag^10 artist`
- `pf = lyrics^6 lastfm_content_artist^6 title^10`
- `ps = 3`

## Evaluation Metrics

- **Accuracy**
- **Recall**
- **Precision**
- **Precision at 10 (P@10)**
- **Average Precision (AvP)**
- **Mean Average Precision (MAP)**

## Results

Five queries were tested, comparing the Simple schema against the Advanced schema:

| Query | Description | MAP (Simple) | MAP (Advanced) |
|---|---|---|---|
| 1 | Songs with lyrics related to religion | 0.5272 | 0.7746 |
| 2 | Songs whose artist has hit number 1 in the charts and is Portuguese | 0.3000 | 1.0000 |
| 3 | Songs whose artist is female and talk about empowerment | 0.1534 | 0.8501 |
| 4 | Songs that talk about reflection or love | 0.7326 | 0.8087 |
| 5 | Pop songs that talk about the past | 0.1851 | 0.4216 |

**Global MAP:**

| System | MAP |
|---|---|
| Simple | 0.3848 |
| Advanced | 0.7632 |

## Conclusion

The **Advanced** schema — with tokenization, normalization, Portuguese stemming and synonym expansion — consistently outperforms the **Simple** schema across all tested queries, more than doubling the global MAP (0.3848 → 0.7632).