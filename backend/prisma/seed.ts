import prisma from "../src/config/db";
import bcrypt from "bcrypt";

async function main() {
  // Demo password
  const password = await bcrypt.hash("password123", 10);

  // Users
  const users = [
    { email: "admin@example.com", name: "Admin User", role: "ADMIN" as const },
    { email: "sales@example.com", name: "Sales User", role: "SALES" as const },
    { email: "warehouse@example.com", name: "Warehouse User", role: "WAREHOUSE" as const },
    { email: "accounts@example.com", name: "Accounts User", role: "ACCOUNTS" as const },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password,
        role: u.role,
      },
    });
  }

  // Customers
  const customer = await prisma.customer.create({
    data: {
      customerName: "Acme Corp",
      mobile: "1234567890",
      email: "contact@acmecorp.com",
      businessName: "Acme Corporation Ltd",
      customerType: "WHOLESALE",
      status: "ACTIVE",
    },
  });

  // Products
  const product1 = await prisma.product.create({
    data: {
      productName: "Industrial Widget A",
      sku: "WID-A-100",
      category: "Hardware",
      unitPrice: 50.0,
      currentStock: 100,
      minimumStock: 20,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      productName: "Premium Gadget B",
      sku: "GAD-B-200",
      category: "Electronics",
      unitPrice: 150.0,
      currentStock: 50,
      minimumStock: 10,
    },
  });

  // Initial Stock Movements
  await prisma.stockMovement.create({
    data: {
      productId: product1.id,
      quantityChanged: 100,
      movementType: "IN",
      reason: "Initial Stock",
      createdBy: "System",
    }
  });

  await prisma.stockMovement.create({
    data: {
      productId: product2.id,
      quantityChanged: 50,
      movementType: "IN",
      reason: "Initial Stock",
      createdBy: "System",
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
