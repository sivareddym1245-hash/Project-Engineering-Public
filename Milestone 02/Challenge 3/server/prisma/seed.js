const prisma = require('../db');

async function main() {
  // Clear existing data
  await prisma.task.deleteMany({});
  await prisma.score.deleteMany({});

  // Seed tasks
  await prisma.task.createMany({
    data: [
      { title: 'Finish assignment', completed: false, isImportant: true },
      { title: 'Review lecture notes', completed: true, completedAt: new Date(), isImportant: true },
      { title: 'Complete coding challenge', completed: false },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
