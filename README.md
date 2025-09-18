# Pegaso Project Work - Backend

Questo repository contiene il backend del progetto **Pegaso Project Work**, sviluppato con **Node.js**, **Express.js** e **MongoDB**.  
L’applicativo espone API REST ed è strutturato per lavorare in un’architettura **full stack e API based**.

---

## 🚀 Avvio del progetto

Clona il repository ed installa le dipendenze:

```bash
  npm install
```

Avvia il server in modalità sviluppo:
```bash
  npm dev
```

---

## 🧪 Test

Il progetto utilizza Jest e Supertest per il testing.

Avviare i test:
```bash
  npm test
```

---

## 🗄️ Database MongoDB

Il progetto utilizza MongoDB come database.
Per garantire un ambiente isolato e riproducibile, MongoDB viene eseguito in Docker.

Avvio container MongoDB
```bash
    docker run -d \
    --name pegaso-mongo \
    -p 27017:27017 \
    -v pegaso-mongo-data:/data/db \
    mongo:latest
```

Il database sarà accessibile su:
```bash
    mongodb://localhost:27017
```

--- 

## 🛠️ Strumenti di supporto

- MongoDB Compass → per ispezionare e gestire i dati del database
- Swagger UI → per consultare e testare le API tramite interfaccia web

--- 

## 📦 Tecnologie principali

- Express.js → framework backend
- Mongoose → ODM per MongoDB
- bcryptjs → hashing password
- jsonwebtoken → autenticazione JWT
- Swagger-jsdoc e Swagger-ui-express → documentazione API
- pdfkit → generazione documenti PDF
- Jest + Supertest → testing
- Docker → containerizzazione del database MongoDB