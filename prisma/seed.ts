import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const salesGoals = [
    { id: 'reviews', name: 'Monthly Reviews', target: 10, type: 'link', category: 'sales' },
    { id: 'meetings', name: 'Monthly Out of office meetings', target: 10, type: 'meeting', category: 'sales' },
    { id: 'businesses', name: 'Monthly New Businesses Contacted', target: 25, type: 'business', category: 'sales' },
    { id: 'outboundVolume', name: 'Monthly Outbound Volume', target: 750, type: 'volume', category: 'sales' },
    { id: 'totalSales', name: 'Total Sales Goal', target: 100000, type: 'sale', category: 'sales', isCurrency: true },
    { id: 'partners', name: 'Monthly partner accounts', target: 1, type: 'partner', category: 'sales' }
  ];

  const marketingGoals = [
    { id: 'videos', name: 'Monthly videos', target: 30, type: 'link', category: 'marketing' },
    { id: 'subscribers', name: 'Monthly news letter subscribers', target: 10, type: 'congrats', category: 'marketing' },
    { id: 'facebookPosts', name: 'Monthly Facebook blog posts', target: 10, type: 'link', category: 'marketing' },
    { id: 'linkedinPosts', name: 'Monthly Linked-in blog posts', target: 10, type: 'link', category: 'marketing' },
    { id: 'faqPosts', name: 'Monthly FAQ question update', target: 5, type: 'link', category: 'marketing' }
  ];

  for (const goal of [...salesGoals, ...marketingGoals]) {
    await prisma.goal.upsert({
      where: { id: goal.id },
      update: goal,
      create: goal,
    });
  }

  await prisma.globalSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: 'Green Mainland Luxury Windows and Doors',
      documentTitle: 'Cost Estimate',
      disclaimerText: 'This estimate does not include installation and is not an official quote.',
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
