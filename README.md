# Welcome to Appointments' Calendar

A simple appointments calendar for patients' registration.

![SAPUI5](https://lh3.googleusercontent.com/HXxdPjeJvoGYP_wsSEaDF4zVNfBM2fJFWL1RGUZ78VwJN9WdNWU5b9VJmabEguX0fofdPIKf3wA0s0OBkRFlnmZntSw5BQJLgV7qK2sgs5X3AjA7g3yqukBsxtPuzspS8BehZ3qUFvHqCo9jeKz3g6heh5Dk1aZQq-ezIdTU6f1f_c6wFMnTuUZwSus-59lKzBNQuVp7kisamLvcNbVQQXXXFMZ4iRyOOIlVRZPvIKZHWQ5JN0GF1zU2YqIG1aapkKI5fI7-BYutz6B_k7cWEZ0mKbZaogOMwgfgq1VoNFr6W5d1P1mCXf-_sE_g-H1_5IdvPZvNmoojZBOMj18B_sKlTaTBZQWiDVaBfET_g19uZUryNQ8Mx_JKIao01iLrJow7KMzI0FwBylldbHtB4SdTGPXWugN9EmL_Q7tZsBJQ9KU48aQu8Yz8K0nQue5aoQFrcrD0LJn77L-ZuJWNSXzY7AySBpYMias4jfbzduc32-u4s0JFuOxXfGYRhbhJtqdQkM6-CQfDVmqNRysxazHkYjwyyNVnbE-39-XzV6BU-8qgI7n83fhifWWdN61iKSvxfkkbSCIaAEHMbEecwk8Bk2ELPZ1EPxGlxtwO8EIicucbNiXKnXWKrI-daXu66x0wQoa11kRhrdhu_zOxlpylZx6YwQ_ZSvi4p_cU_7S2hdIlKO59SzyFYFNH7g=w1261-h448-no?authuser=1)

# Description

There is a possibility to make appointments for each doctor's patients. The system validates appointment time for overlapping with other patients and also forbids the same patients' visits to the same doctor during seven days timespan.

## Create files and folders

 - SAPUI5
 - PostgreSQL
 - Express.js 
 - Docker


## Installation

 1. Download a repository: `git clone https://github.com/waidokas/addendum`
 2. Change to: `cd addendum`
 3. Install dependencies: `npm install`
 4. Instal UI5 CLI `npm install --global @ui5/cli`
 5. Install PosgreSQL:  `docker-compose up -d` 
 6. Run a back end server: **`node ./webapp/api/app.js`**
 7. Migrate data by: http://localhost:3000/migrate
 8. Run a front end: **`npm start`**
 9. Application should be accessible under: http://localhost:8080/index.html

## Database

Two docker images are used:

 1. Database
 2. pgAdmin. To access admin panel please use: http://localhost:8888/

pgAdmin username: `admin@email.com`
pgAdmin password: `admin`
DB login: `db_user`
DB password: `db_password`
Database name: `db_user`
Data migration file: `addendum/webapp/api/migrations/createData.js` 
Could be invoked by: http://localhost:3000/migrate  (caution: all previous data is destroyed)

## Back-End

Managed by Express.js and resides under`api/` folder. 
Routes are described in `data.js`, data manipulation functions in `db.js`.


## Front-End

Based on SAPUI5 framework. 
Used:

 - Planning Calendar control 
 - dialog and popover as fragments. Each has it's own controller.
 - I18N. Supports LT and EN locales detected by browser settings. Translation file could be found in `i18n/`.
 - data is manipulated using Rest API (`webapp/util/ApiCalls.js`).
 - validation rules placed in `webapp/util/Validation.js`.


