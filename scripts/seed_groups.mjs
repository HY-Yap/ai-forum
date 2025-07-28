import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import crypto from "node:crypto";

// 🔑  path to the SAME key you used earlier
initializeApp({ credential: cert("./service-account.json") });
const db = getFirestore();

// --------- generate 16 placeholder docs ----------
const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " +
    "Nemo minus ullam non eaque, eligendi ipsa.";

for (let i = 1; i <= 16; i++) {
    const id = `g${i}`; // g1 … g16
    await db
        .collection("groups")
        .doc(id)
        .set({
            title: `Example Project ${i}`,
            summary: lorem,
            number: i, // optional, if you added this field
        });
}

console.log("Inserted 16 group docs.");
process.exit();
