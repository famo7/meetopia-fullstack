const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.actionItem.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.meetingNote.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Test User 1',
      email: 'test@gmail.com',
      passwordHash: hashedPassword
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Test User 2',
      email: 'test2@gmail.com',
      passwordHash: hashedPassword
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Test User 3',
      email: 'test3@gmail.com',
      passwordHash: hashedPassword
    }
  });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const meeting1 = await prisma.meeting.create({
    data: {
      title: 'Daily Standup',
      description: 'Daily team standup meeting',
      startTime: today,
      endTime: new Date(today.getTime() + 60 * 60 * 1000),
      status: 'SCHEDULED',
      creatorId: user1.id
    }
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      title: 'Project Planning',
      description: 'Planning session for new features',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      status: 'SCHEDULED',
      creatorId: user2.id
    }
  });

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const meeting3 = await prisma.meeting.create({
    data: {
      title: 'Sprint Retrospective',
      description: 'End of sprint retrospective meeting',
      startTime: yesterday,
      endTime: new Date(yesterday.getTime() + 90 * 60 * 1000),
      status: 'ENDED',
      creatorId: user1.id
    }
  });

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const meeting4 = await prisma.meeting.create({
    data: {
      title: 'Client Presentation',
      description: 'Cancelled due to client unavailability',
      startTime: lastWeek,
      endTime: new Date(lastWeek.getTime() + 60 * 60 * 1000),
      status: 'CANCELLED',
      creatorId: user2.id
    }
  });

  const meeting5 = await prisma.meeting.create({
    data: {
      title: 'Team Brainstorming',
      description: 'Active brainstorming session in progress',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
      status: 'ACTIVE',
      creatorId: user3.id
    }
  });

  const meeting6 = await prisma.meeting.create({
    data: {
      title: 'Collaborative Workshop',
      description: 'Active workshop with all team members',
      startTime: today,
      endTime: new Date(today.getTime() + 60 * 60 * 1000),
      status: 'ACTIVE',
      creatorId: user3.id
    }
  });

  await prisma.participant.create({
    data: {
      userId: user3.id,
      meetingId: meeting1.id,
      role: 'PARTICIPANT'
    }
  });

  await prisma.participant.create({
    data: {
      userId: user3.id,
      meetingId: meeting2.id,
      role: 'PARTICIPANT'
    }
  });

  await prisma.participant.create({
    data: {
      userId: user3.id,
      meetingId: meeting3.id,
      role: 'PARTICIPANT'
    }
  });

  await prisma.participant.create({
    data: {
      userId: user3.id,
      meetingId: meeting4.id,
      role: 'PARTICIPANT'
    }
  });

  // Add user1 and user2 as participants to meeting6 (created by user3)
  await prisma.participant.create({
    data: {
      userId: user1.id,
      meetingId: meeting6.id,
      role: 'PARTICIPANT'
    }
  });

  await prisma.participant.create({
    data: {
      userId: user2.id,
      meetingId: meeting6.id,
      role: 'PARTICIPANT'
    }
  });

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const twoWeeks = new Date(today);
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  const actionItem1 = await prisma.actionItem.create({
    data: {
      title: 'Review code changes',
      description: 'Review pull requests for sprint 5',
      status: 'OPEN',
      priority: 'HIGH',
      dueDate: nextWeek,
      meetingId: meeting1.id,
      createdById: user1.id,
      assignedById: user1.id,
      assignedToId: user3.id
    }
  });

  const actionItem2 = await prisma.actionItem.create({
    data: {
      title: 'Update documentation',
      description: 'Update API documentation for new endpoints',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      meetingId: meeting1.id,
      createdById: user1.id,
      assignedById: user1.id,
      assignedToId: user2.id
    }
  });

  const actionItem3 = await prisma.actionItem.create({
    data: {
      title: 'Fix critical bug',
      description: 'Fix production bug in payment system',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: nextWeek,
      meetingId: meeting1.id,
      createdById: user1.id,
      assignedById: user1.id,
      assignedToId: user1.id
    }
  });

  const actionItem4 = await prisma.actionItem.create({
    data: {
      title: 'Prepare presentation',
      description: 'Prepare slides for project demo',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: twoWeeks,
      meetingId: meeting2.id,
      createdById: user2.id,
      assignedById: user2.id,
      assignedToId: user3.id
    }
  });

  const actionItem5 = await prisma.actionItem.create({
    data: {
      title: 'Design new feature',
      description: 'Create mockups for user dashboard redesign',
      status: 'OPEN',
      priority: 'LOW',
      dueDate: twoWeeks,
      meetingId: meeting2.id,
      createdById: user2.id,
      assignedById: user2.id,
      assignedToId: user1.id
    }
  });

  const actionItem6 = await prisma.actionItem.create({
    data: {
      title: 'Setup testing environment',
      description: 'Configure Jest and Playwright for testing',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: nextWeek,
      meetingId: meeting2.id,
      createdById: user2.id,
      assignedById: user2.id,
      assignedToId: user2.id
    }
  });

  const actionItem7 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser2_fromUser1',
      description: 'assignedToUser2_fromUser1',
      status: 'OPEN',
      priority: 'HIGH',
      dueDate: nextWeek,
      meetingId: meeting6.id,
      createdById: user1.id,
      assignedById: user1.id,
      assignedToId: user2.id
    }
  });

  const actionItem8 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser3_fromUser1',
      description: 'assignedToUser3_fromUser1',
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      meetingId: meeting6.id,
      createdById: user1.id,
      assignedById: user1.id,
      assignedToId: user3.id
    }
  });

  const actionItem9 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser1_fromUser2',
      description: 'assignedToUser1_fromUser2',
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      meetingId: meeting6.id,
      createdById: user2.id,
      assignedById: user2.id,
      assignedToId: user1.id
    }
  });

  const actionItem10 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser3_fromUser2',
      description: 'assignedToUser3_fromUser2',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      meetingId: meeting6.id,
      createdById: user2.id,
      assignedById: user2.id,
      assignedToId: user3.id
    }
  });

  const actionItem11 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser1_fromUser3',
      description: 'assignedToUser1_fromUser3',
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: nextWeek,
      meetingId: meeting6.id,
      createdById: user3.id,
      assignedById: user3.id,
      assignedToId: user1.id
    }
  });

  const actionItem12 = await prisma.actionItem.create({
    data: {
      title: 'assignedToUser2_fromUser3',
      description: 'assignedToUser2_fromUser3',
      status: 'OPEN',
      priority: 'LOW',
      dueDate: twoWeeks,
      meetingId: meeting6.id,
      createdById: user3.id,
      assignedById: user3.id,
      assignedToId: user2.id
    }
  });
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });