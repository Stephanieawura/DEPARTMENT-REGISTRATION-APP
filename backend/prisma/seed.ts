import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Courses
  const courses = [
    {
      code: 'DCIT 301',
      title: 'Software Engineering',
      credits: 3,
      lecturer: 'Dr. K. Acheampong',
      description: 'Introduction to software development methodologies, project management, testing strategies, and best practices in modern software engineering.',
      prerequisites: 'DCIT 201, DCIT 203',
      schedule: 'Mon & Wed, 10:00am – 11:30am',
      venue: 'DCSIT Lab 3',
      enrolled: 87,
      capacity: 120,
    },
    {
      code: 'DCIT 303',
      title: 'Computer Networks',
      credits: 3,
      lecturer: 'Dr. A. Mensah',
      description: 'Study of computer network architectures, protocols, and technologies. Topics include TCP/IP, routing, network security, and wireless communications.',
      prerequisites: 'DCIT 201',
      schedule: 'Tue & Thu, 2:00pm – 3:30pm',
      venue: 'DCSIT LT 1',
      enrolled: 92,
      capacity: 100,
    },
    {
      code: 'DCIT 305',
      title: 'Database Management Systems',
      credits: 3,
      lecturer: 'Prof. E. Bediako',
      description: 'Comprehensive coverage of database design, normalization, SQL, transactions, and NoSQL databases.',
      prerequisites: 'DCIT 203',
      schedule: 'Mon & Wed, 2:00pm – 3:30pm',
      venue: 'DCSIT Lab 2',
      enrolled: 78,
      capacity: 100,
    },
    {
      code: 'DCIT 307',
      title: 'Operating Systems',
      credits: 3,
      lecturer: 'Dr. S. Asante',
      description: 'Exploration of operating system concepts including process management, memory management, file systems, and concurrency control.',
      prerequisites: 'DCIT 202',
      schedule: 'Tue & Thu, 10:00am – 11:30am',
      venue: 'DCSIT LT 2',
      enrolled: 105,
      capacity: 110,
    },
    {
      code: 'DCIT 313',
      title: 'Introduction to Artificial Intelligence',
      credits: 3,
      lecturer: 'Dr. F. Osei',
      description: 'Fundamental concepts of AI, including search algorithms, knowledge representation, machine learning basics, and logic.',
      prerequisites: 'DCIT 201, MATH 223',
      schedule: 'Fri, 1:00pm – 3:50pm',
      venue: 'JQB 23',
      enrolled: 120,
      capacity: 120,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: course,
    });
  }

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create an Admin User
  await prisma.user.upsert({
    where: { email: 'admin@dept.edu' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@dept.edu',
      password: hashedPassword,
      name: 'Department Admin',
      role: 'ADMIN',
    },
  });

  // Create a Student User
  await prisma.user.upsert({
    where: { email: 'student@dept.edu' },
    update: { password: hashedPassword },
    create: {
      email: 'student@dept.edu',
      password: hashedPassword,
      name: 'John Doe',
      role: 'STUDENT',
      studentId: '10912345',
      program: 'BSc Computer Science',
      level: '300',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
