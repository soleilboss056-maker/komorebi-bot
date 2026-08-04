import { initializeApp } from 'firebase/app';
import { initializeFirestore, getDoc, doc, terminate } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

async function test() {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    console.error("No config file found");
    return;
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log("Config loaded:", config);

  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  };

  const app1 = initializeApp(firebaseConfig, "app1");
  const app2 = initializeApp(firebaseConfig, "app2");
  const dbCustom = initializeFirestore(app1, {
    databaseId: config.firestoreDatabaseId
  } as any);
  const dbDefault = initializeFirestore(app2, {});

  console.log("\n--- Testing Custom Database with Client SDK ---");
  try {
    const docRef = doc(dbCustom, 'bot_config', 'main');
    const snap = await getDoc(docRef);
    console.log("Client SDK Custom DB Success! Doc exists:", snap.exists());
  } catch (err: any) {
    console.error("Client SDK Custom DB Failed:", err.message || err);
  }

  console.log("\n--- Testing Default Database with Client SDK ---");
  try {
    const docRef = doc(dbDefault, 'bot_config', 'main');
    const snap = await getDoc(docRef);
    console.log("Client SDK Default DB Success! Doc exists:", snap.exists());
  } catch (err: any) {
    console.error("Client SDK Default DB Failed:", err.message || err);
  } finally {
    console.log("Terminating Firestore...");
    await terminate(dbCustom);
    await terminate(dbDefault);
    console.log("Terminated.");
  }
}

test().catch(console.error);
