import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs/promises";

// ---------- EDIT THESE ----------
const projectId = "ai-forum-147a0";
const serviceAccountPath = "./service-account.json"; // download from console
//---------------------------------

initializeApp({ credential: cert(serviceAccountPath), projectId });
const db = getFirestore();

const students = 64;
const teachers = 20;

const genToken = () => crypto.randomUUID().replace(/-/g, ""); // long & unguessable

const ops = [];

for (let i = 0; i < students; i++) {
    ops.push({ token: genToken(), weight: 1 });
}
for (let i = 0; i < teachers; i++) {
    ops.push({ token: genToken(), weight: 2 });
}

console.log("Writing", ops.length, "voter docs…");
const batch = db.batch();
ops.forEach((o) => {
    batch.set(db.collection("voters").doc(o.token), {
        weight: o.weight,
        votes: [],
    });
});
await batch.commit();

await fs.writeFile(
    "./voter_links.csv",
    ops
        .map(
            (o) =>
                `https://ai-forum-147a0.web.app/vote.html?token=${o.token},weight:${o.weight}`
        )
        .join("\n")
);
console.log("Done. Links saved to voter_links.csv");
process.exit();
