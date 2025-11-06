# Movie Database Management Program  

This program manages a database of films, allowing users to perform CRUD operations (Create, Read, Update, Delete) and generate statistical reports. Each film record includes:  
- **Title**  
- **Release year**  
- **Cast** (actors)  
- **Genres**  
- **Unique ID**  

## Core Features  

### 1. Database Handling  
- **Load/Save** the database to/from a file (e.g., JSON).  

### 2. Film Operations  
- **Add**: Insert a new film with all metadata.  
- **Search**: Find films by *ID* or *title*.  
- **Update**: Modify existing film details (e.g., cast, genres).  

### 3. Listing & Filtering  
- List all films **alphabetically by title**.  
- Filter films by **genre** (e.g., "Drama", "Sci-Fi").  
- Filter films by **actor** (e.g., list all films with Leonardo DiCaprio).  

### 4. Statistical Insights  
- Total **number of films** in the database.  
- **Actors Directory**: Alphabetical list of actors with their associated films (titles + IDs).  
- **Genres Directory**: Alphabetical list of genres with their associated films (titles + IDs).  

### 5. User-Friendly Interface  
- All features are accessible via a **graphical UI (GUI)** for intuitive navigation.  

## Use Cases  
- Movie enthusiasts tracking their favorite films.  
- Researchers analyzing film metadata (e.g., genre trends, actor collaborations).  
- Personal cataloging of watched films.  

The program combines **data management** with **analytical tools**, making it versatile for both casual and power users.  

# How to install

Run the following commands to install the libraries to run the project.

~~~bash
python3 -m pip uninstall PySimpleGUI
python3 -m pip cache purge
python3 -m pip install --upgrade --extra-index-url https://PySimpleGUI.net/install PySimpleGUI
~~~

~~~bash
sudo apt install python3-tk
~~~

# How to run

Run:

~~~bash
python3 project/Projeto_Visuals.py 
~~~

Then, click in "Carregar" and then in "Browse". Add the filmes.json file and click in "Abrir". After that, you can work with all the mentioned functionalities.

# Members
- Ema Martins a97678
- Luís Gonçalves a95637
- Henrique Malheiro a97455


