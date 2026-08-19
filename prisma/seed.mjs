import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const CATEGORIES = [
    "Books",
    "Laptop",
    "Calculator",
    "Camera",
    "Mobile",
    "Charger",
    "Sports Equipment",
    "Electronics",
    "Others",
];
async function main() {
    console.log("Seeding database…");
    await prisma.category.createMany({
        data: CATEGORIES.map((name) => ({ name })),
        skipDuplicates: true,
    });
    const adminPassword = await bcrypt.hash("Admin@12345", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@borrowbox.diu.edu.bd" },
        update: {},
        create: {
            name: "System Admin",
            email: "admin@borrowbox.diu.edu.bd",
            passwordHash: adminPassword,
            role: Role.ADMIN,
        },
    });
    const studentPassword = await bcrypt.hash("Student@12345", 10);
    await Promise.all([
        { name: "Nahid", email: "nahid@diu.edu.bd" },
        { name: "Nabil", email: "nabil@diu.edu.bd" },
        { name: "Shihab", email: "shihab@diu.edu.bd" },
        { name: "Tamim", email: "tamim@diu.edu.bd" },
        { name: "Rafi", email: "rafi@diu.edu.bd" },
    ].map((u) => prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash: studentPassword, role: Role.STUDENT },
    })));
    console.log("Seed complete.");
    console.log(`Admin login: admin@borrowbox.diu.edu.bd / Admin@12345`);
    console.log(`Student login (any seeded student): <email> / Student@12345`);
    void admin;
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
