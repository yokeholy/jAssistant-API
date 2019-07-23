# jAssistant-API
*Your personal life management assistant*

For general introduction of jAssistant, please visit the [UI repository](https://github.com/yokeholy/jAssistant-UI).

## Get Started

### 0. Prerequisite
You will need the following to be set up before you can run jAssistant

- A running `mysql` server and create an empty database to initialize the starting database.
- SSL certificate and private key for your API server

### 1. Checkout the project and run `npm install`

### 2. Set up the config file and place your SSL files
- Go to `config` folder and make a copy from `production.sample.js` file and rename it `production.js`.

- Also make a copy from `database.sample.json` file and rename it `database.json`.
Fill in each field in those config files and save it.

- Put your SSL certificate and private key in the `ssl` folder and point to them correctly in your config file.

### 3. Populate your database structure by running `npm run migrate`

#### 3.1. Create a user for yourself:
Go to the database, in `user` table, insert a new user. `password` should be a bcrypt hash value.

### 4. Run `npm run dev`
Testing account: `demo@example.com`
Password: `jAssistant2019`

### 5. When you're ready to deploy it to production, run `npm start`