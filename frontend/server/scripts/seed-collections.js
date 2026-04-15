#!/usr/bin/env node
'use strict';

/**
 * Ensures every FACTACTO activity category collection exists in MongoDB.
 * Uses the same names as server/lib/categoryCollections.js (hyphens → underscores).
 *
 * Run from the frontend directory: npm run db:seed-collections
 * Requires frontend/.env with MONGO_URI or MONGODB_* + DB_NAME / MONGODB_DB_NAME.
 */

const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { getCategoryCollectionNames } = require('../lib/categoryCollections');

const frontendRoot = path.join(__dirname, '..', '..');
dotenv.config({ path: path.join(frontendRoot, '.env') });

function resolveMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const base = process.env.MONGODB_URI;
  const user = process.env.MONGODB_USERNAME;
  const pass = process.env.MONGODB_PASSWORD;
  if (!base || !user || !pass) return null;
  const m = String(base).match(/^mongodb\+srv:\/\/([^/?]+)\/?(.*)$/i);
  if (!m) return null;
  const host = m[1];
  const pathAndQuery = m[2] || '';
  const u = encodeURIComponent(user);
  const p = encodeURIComponent(pass);
  return `mongodb+srv://${u}:${p}@${host}/${pathAndQuery}`;
}

function getDbName() {
  return process.env.DB_NAME || process.env.MONGODB_DB_NAME || 'mdb';
}

async function main() {
  const uri = resolveMongoUri();
  if (!uri) {
    console.error(
      'Missing MongoDB config in frontend/.env (MONGO_URI or MONGODB_URI + MONGODB_USERNAME + MONGODB_PASSWORD).',
    );
    process.exit(1);
  }

  const dbName = getDbName();
  const names = getCategoryCollectionNames();
  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db(dbName);

  console.log(`Database: ${dbName}`);
  console.log(`Creating ${names.length} category collections if missing…\n`);

  for (const name of names) {
    const existing = await db.listCollections({ name }).toArray();
    if (existing.length > 0) {
      console.log(`  exists   ${name}`);
      continue;
    }
    await db.createCollection(name);
    console.log(`  created  ${name}`);
  }

  await client.close();
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
