#!/bin/bash

cd database
npx knex migrate:latest
node db_init.js
cd ..
npm run start:dev