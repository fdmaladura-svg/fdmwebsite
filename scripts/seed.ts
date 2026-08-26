import "dotenv/config";
import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .then((counts) => {
    console.log("Seed complete.", counts);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
