const cron = require("node-cron");
const { sendVaccineReminders } = require("../services/reminderService");

function sendJob(){
  cron.schedule("* 12 * * *", () => {
  console.log("Running test...");
  sendVaccineReminders();
  });
}
sendJob();

module.exports = {sendJob}