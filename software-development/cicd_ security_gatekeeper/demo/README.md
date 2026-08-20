
```bash
pip install flask pymongo
```

```bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Atualizar repositórios
sudo apt update

# Instalar MongoDB
sudo apt install -y mongodb-org

# Iniciar serviço
sudo systemctl start mongod

# Habilitar para iniciar automaticamente
sudo systemctl enable mongod

# Testar status
sudo systemctl status mongod
```

# Run back

```bash
python3 api.py
```

# Run front

```bash
npm install
npm run dev
```