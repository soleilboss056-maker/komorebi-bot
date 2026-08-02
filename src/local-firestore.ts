import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DB_PATH = path.join(process.cwd(), 'mock-db.json');

// Initialize empty mock DB file if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2), 'utf8');
}

function readDb(): Record<string, Record<string, any>> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(content || '{}');
    }
  } catch (err) {
    console.error('Failed to read local mock DB:', err);
  }
  return {};
}

function writeDb(data: Record<string, Record<string, any>>): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write local mock DB:', err);
  }
}

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || '';
export let isMongoConnected = false;

if (MONGO_URI) {
  console.log('Connecting to MongoDB...');
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    family: 4, // Force IPv4 to avoid slow DNS lookups
  })
    .then(() => {
      console.log('🟢 MongoDB Connected successfully!');
      isMongoConnected = true;
    })
    .catch((err) => {
      console.error('🔴 MongoDB connection failed (using secure local database fallback instead):', err.message);
      console.log('ℹ️ Remarque: Pour connecter MongoDB au Cloud Run, assurez-vous d\'autoriser toutes les IP (0.0.0.0/0) dans l\'onglet Network Access de votre console MongoDB Atlas.');
      isMongoConnected = false;
    });
}

// Generic MongoDB Schema to match Firestore key-value / collection structure
const MongoDocSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  docId: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

MongoDocSchema.index({ collectionName: 1, docId: 1 }, { unique: true });

const MongoDoc: any = mongoose.models.MongoDoc || mongoose.model('MongoDoc', MongoDocSchema);

export class MockFirestore {
  collection(colName: string) {
    return new MockCollectionReference(colName);
  }

  batch() {
    return new MockWriteBatch();
  }
}

class MockCollectionReference {
  constructor(private colName: string) {}

  doc(docId?: string) {
    const id = docId || Math.random().toString(36).substring(2, 15);
    return new MockDocumentReference(this.colName, id);
  }

  where(field: string, op: string, value: any) {
    return new MockQuery(this.colName, [{ field, op, value }]);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return new MockQuery(this.colName, [], { field, direction });
  }

  limit(limitNum: number) {
    return new MockQuery(this.colName, [], undefined, limitNum);
  }

  async get() {
    return new MockQuery(this.colName, []).get();
  }
}

class MockDocumentReference {
  constructor(public colName: string, public id: string) {}

  collection(colName: string) {
    return new MockCollectionReference(`${this.colName}/${this.id}/${colName}`);
  }

  async get() {
    if (isMongoConnected) {
      try {
        const doc = await MongoDoc.findOne({ collectionName: this.colName, docId: this.id });
        return {
          exists: !!doc,
          id: this.id,
          ref: this,
          data: () => doc ? doc.data : undefined
        };
      } catch (err) {
        console.error(`MongoDB error in get() for ${this.colName}/${this.id}:`, err);
      }
    }

    // Fallback to local JSON
    const db = readDb();
    const col = db[this.colName] || {};
    const exists = Object.prototype.hasOwnProperty.call(col, this.id);
    const docData = exists ? col[this.id] : undefined;

    return {
      exists,
      id: this.id,
      ref: this,
      data: () => docData
    };
  }

  async set(data: any, options?: { merge?: boolean }) {
    if (isMongoConnected) {
      try {
        if (options?.merge) {
          const doc = await MongoDoc.findOne({ collectionName: this.colName, docId: this.id });
          const existing = doc ? doc.data : {};
          const merged = { ...existing, ...data };
          await MongoDoc.findOneAndUpdate(
            { collectionName: this.colName, docId: this.id },
            { data: merged },
            { upsert: true, new: true }
          );
        } else {
          await MongoDoc.findOneAndUpdate(
            { collectionName: this.colName, docId: this.id },
            { data: data },
            { upsert: true, new: true }
          );
        }
        return;
      } catch (err) {
        console.error(`MongoDB error in set() for ${this.colName}/${this.id}:`, err);
      }
    }

    // Fallback to local JSON
    const db = readDb();
    if (!db[this.colName]) {
      db[this.colName] = {};
    }

    if (options?.merge) {
      const existing = db[this.colName][this.id] || {};
      db[this.colName][this.id] = { ...existing, ...data };
    } else {
      db[this.colName][this.id] = { ...data };
    }

    writeDb(db);
  }

  async update(data: any) {
    if (isMongoConnected) {
      try {
        const doc = await MongoDoc.findOne({ collectionName: this.colName, docId: this.id });
        const existing = doc ? doc.data : {};
        const updated = { ...existing, ...data };
        await MongoDoc.findOneAndUpdate(
          { collectionName: this.colName, docId: this.id },
          { data: updated },
          { upsert: true, new: true }
        );
        return;
      } catch (err) {
        console.error(`MongoDB error in update() for ${this.colName}/${this.id}:`, err);
      }
    }

    // Fallback to local JSON
    const db = readDb();
    if (!db[this.colName]) {
      db[this.colName] = {};
    }

    const existing = db[this.colName][this.id] || {};
    db[this.colName][this.id] = { ...existing, ...data };
    writeDb(db);
  }

  async delete() {
    if (isMongoConnected) {
      try {
        await MongoDoc.deleteOne({ collectionName: this.colName, docId: this.id });
        return;
      } catch (err) {
        console.error(`MongoDB error in delete() for ${this.colName}/${this.id}:`, err);
      }
    }

    // Fallback to local JSON
    const db = readDb();
    if (db[this.colName] && db[this.colName][this.id]) {
      delete db[this.colName][this.id];
      writeDb(db);
    }
  }
}

class MockQuery {
  constructor(
    private colName: string,
    private filters: { field: string; op: string; value: any }[] = [],
    private order?: { field: string; direction: 'asc' | 'desc' },
    private limitNum?: number
  ) {}

  where(field: string, op: string, value: any) {
    return new MockQuery(this.colName, [...this.filters, { field, op, value }], this.order, this.limitNum);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return new MockQuery(this.colName, this.filters, { field, direction }, this.limitNum);
  }

  limit(limitNum: number) {
    return new MockQuery(this.colName, this.filters, this.order, limitNum);
  }

  async get() {
    let docsList: { id: string, data: any, ref: MockDocumentReference }[] = [];

    if (isMongoConnected) {
      try {
        const docs = await MongoDoc.find({ collectionName: this.colName });
        docsList = docs.map(d => ({
          id: d.docId || '',
          data: d.data,
          ref: new MockDocumentReference(this.colName, d.docId || '')
        }));
      } catch (err) {
        console.error(`MongoDB error in query get() for ${this.colName}:`, err);
      }
    }

    if (!isMongoConnected || docsList.length === 0) {
      // Fallback to local JSON
      const db = readDb();
      const col = db[this.colName] || {};
      docsList = Object.keys(col).map(id => ({
        id,
        data: col[id],
        ref: new MockDocumentReference(this.colName, id)
      }));
    }

    // Apply filters
    for (const filter of this.filters) {
      docsList = docsList.filter(doc => {
        const val = doc.data[filter.field];
        if (filter.op === '==') return val === filter.value;
        if (filter.op === '!=') return val !== filter.value;
        if (filter.op === '>') return val > filter.value;
        if (filter.op === '<') return val < filter.value;
        if (filter.op === '>=') return val >= filter.value;
        if (filter.op === '<=') return val <= filter.value;
        return true;
      });
    }

    // Apply ordering
    if (this.order) {
      const { field, direction } = this.order;
      docsList.sort((a, b) => {
        const valA = a.data[field];
        const valB = b.data[field];
        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitNum !== undefined) {
      docsList = docsList.slice(0, this.limitNum);
    }

    const queryDocs = docsList.map(doc => ({
      id: doc.id,
      ref: doc.ref,
      data: () => doc.data
    }));

    return {
      empty: queryDocs.length === 0,
      docs: queryDocs,
      forEach: (callback: (doc: any) => void) => {
        queryDocs.forEach(callback);
      }
    };
  }
}

class MockWriteBatch {
  private operations: (() => Promise<void>)[] = [];

  delete(docRef: any) {
    this.operations.push(async () => {
      await docRef.delete();
    });
    return this;
  }

  set(docRef: any, data: any, options?: any) {
    this.operations.push(async () => {
      await docRef.set(data, options);
    });
    return this;
  }

  update(docRef: any, data: any) {
    this.operations.push(async () => {
      await docRef.update(data);
    });
    return this;
  }

  async commit() {
    for (const op of this.operations) {
      await op();
    }
  }
}
