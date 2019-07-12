# jAssistant-API
Your personal life management assistant

## Get Started

### 0. Prerequisite

You will need the following to be set up before you can run jAssistant

- `pm2` and `sequelize-cli` installed to run this API.
To install, run `npm install -g pm2 sequelize-cli`
- A running `mysql` server and create an empty database to initialize the starting database.
- SSL certificate and private key for your API server

### 1. Checkout the project and run `npm install`

### 2. Set up the config file and place your SSL files

Go to `config` folder and make a copy from `production.sample.js` file and rename it `production.js`.
Also make a copy from `database.sample.json` file and rename it `database.json`.
Fill in each field in those config files and save it.
Put your SSL certificate and private key in the `ssl` folder and point to them correctly in your config file.

### 3. Populate your database structure by running `sequelize db:migrate`

#### 3.1. Go to your database and insert:
In `user` table, insert a new user for yourself. `password` should be a bcrypt hash value.

### 4. Run `npm run dev`

Test jAssistant-API out.

### 5. When you're ready to deploy it to production, run `npm start`

Builds the app for production to the `build` folder.