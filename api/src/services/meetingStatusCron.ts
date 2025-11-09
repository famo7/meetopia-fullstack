import prisma from '../lib/prisma';

const CHECK_INTERVAL_MS = 60 * 1000;

async function runStatusUpdatePass() {
  const now = new Date();

  try {
    const toActive = await prisma.meeting.updateMany({
      where: {
        status: 'SCHEDULED',
        startTime: { lte: now },
        endTime: { gt: now }
      },
      data: { status: 'ACTIVE' }
    });

    const toEndedFromActive = await prisma.meeting.updateMany({
      where: {
        status: 'ACTIVE',
        endTime: { lte: now }
      },
      data: { status: 'ENDED' }
    });

    const toEndedFromScheduled = await prisma.meeting.updateMany({
      where: {
        status: 'SCHEDULED',
        endTime: { lte: now }
      },
      data: { status: 'ENDED' }
    });

    const totalChanged = (toActive.count || 0) + (toEndedFromActive.count || 0) + (toEndedFromScheduled.count || 0);
    if (totalChanged > 0) {
      console.info(`MeetingStatusCron: updated ${totalChanged} meetings (active:${toActive.count}, endedFromActive:${toEndedFromActive.count}, endedFromScheduled:${toEndedFromScheduled.count})`);
    }
  } catch (err) {
    console.error('MeetingStatusCron: failed to update meeting statuses', err);
  }
}

let intervalHandle: any = null;

export function startMeetingStatusCron() {
  runStatusUpdatePass().catch((err) => console.error('MeetingStatusCron initial run failed', err));

  if (!intervalHandle) {
    intervalHandle = setInterval(() => {
      runStatusUpdatePass();
    }, CHECK_INTERVAL_MS);
    console.info('MeetingStatusCron: started (every 60s)');
  }
}

export function stopMeetingStatusCron() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.info('MeetingStatusCron: stopped');
  }
}
