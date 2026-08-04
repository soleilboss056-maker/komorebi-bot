import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

  const apps = getApps();
  const app = apps.length === 0 ? initializeApp({ projectId: config.projectId }) : getApp();

  console.log("\n--- Testing Custom Database via firebase-admin ---");
  try {
    const dbCustom = getFirestore(app, config.firestoreDatabaseId);
    const snapCustom = await dbCustom.collection('bot_config').doc('main').get();
    console.log("Custom DB Success! Doc exists:", snapCustom.exists);
  } catch (err: any) {
    console.error("Custom DB Failed:", err.message || err);
  }

  console.log("\n--- Testing Default Database via firebase-admin ---");
  try {
    const dbDefault = getFirestore(app);
    const snapDefault = await dbDefault.collection('bot_config').doc('main').get();
    console.log("Default DB Success! Doc exists:", snapDefault.exists);
  } catch (err: any) {
    console.error("Default DB Failed:", err.message || err);
  }
}

test().catch(console.error);
