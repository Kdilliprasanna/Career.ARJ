// Removed require

async function getLogs() {
  try {
    const runsRes = await fetch('https://api.github.com/repos/Kdilliprasanna/Career.ARJ/actions/runs');
    if (!runsRes.ok) throw new Error('Failed to fetch runs');
    const runsData = await runsRes.json();
    const latestRun = runsData.workflow_runs[0];
    console.log(`Latest Run ID: ${latestRun.id}`);

    const jobsRes = await fetch(latestRun.jobs_url);
    if (!jobsRes.ok) throw new Error('Failed to fetch jobs');
    const jobsData = await jobsRes.json();
    const job = jobsData.jobs[0];
    console.log(`Failed Job ID: ${job.id}`);

    const logsRes = await fetch(`https://api.github.com/repos/Kdilliprasanna/Career.ARJ/actions/jobs/${job.id}/logs`);
    const logs = await logsRes.text();

    console.log("---- LOGS (LAST 100 LINES) ----");
    const lines = logs.split('\n');
    console.log(lines.slice(Math.max(lines.length - 100, 0)).join('\n'));
  } catch (err) {
    console.error(err);
  }
}

getLogs();
