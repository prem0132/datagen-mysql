# Install 

1. mysql-client
2. node
3. npm
4. npm install mysql
5. npm install dotenv

## Setup

1. Create .env file
    ```bash
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=**********
        RECORDS_PER_SECOND=10
        WAIT_TIME=3000 // in milliseconds
        SOURCE_DB=source 
    ```
2. Set your PG password as env var PG_PASS


## Execution

provide hostname if needed and run 
1. mysql -u root -p$PG_PASS < setup.sql 
2. node insert.js
