const db = require("../config/db");
const { sendReminderEmail } = require("./mailService");
function getReminderStatus(vaccinationDate) {
  if (!vaccinationDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const vacDate = new Date(vaccinationDate);
  vacDate.setHours(0, 0, 0, 0);

  const diff = Math.ceil((vacDate - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 3) return "upcoming";
  return null;
}

function buildEmailHTML(userName, pets) {
  const rows = pets
    .map((pet) => {
      const status = getReminderStatus(pet.vaccination_date);

      let label = "";
      if (status === "overdue") label = "Overdue ❌";
      if (status === "today") label = "Today ⚠️";
      if (status === "upcoming") label = "Upcoming 🔔";

      return `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${pet.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${pet.type || "N/A"}</td>
          <td style="padding:8px;border:1px solid #ddd;">${pet.vaccination_date || "N/A"}</td>
          <td style="padding:8px;border:1px solid #ddd;">${label}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;padding:20px;">
      <h2>🐾 PetCare Vaccination Reminder</h2>
      <p>Hello ${userName},</p>
      <p>These pets need your attention:</p>

      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #ddd;">Pet Name</th>
            <th style="padding:8px;border:1px solid #ddd;">Type</th>
            <th style="padding:8px;border:1px solid #ddd;">Vaccination Date</th>
            <th style="padding:8px;border:1px solid #ddd;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="margin-top:16px;">Please update your pet care schedule.</p>
      <p>— PetCare Team</p>
    </div>
  `;
}

function sendVaccineReminders() {
  const sql = `
    SELECT 
      users.id AS user_id,
      users.name AS user_name,
      users.email,
      pets.id,
      pets.name,
      pets.type,
      pets.vaccination_date
    FROM users
    INNER JOIN pets ON users.id = pets.user_id
    WHERE users.role = 'owner'
    -- WHERE pets.vaccination_date IS NOT NULL
      AND pets.vaccination_date IS NOT NULL
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      console.log("REMINDER QUERY ERROR:", err);
      return;
    }

    const grouped = {};

    results.forEach((row) => {
      const status = getReminderStatus(row.vaccination_date);
      if (!status) return;

      if (!grouped[row.user_id]) {
        grouped[row.user_id] = {
          userName: row.user_name,
          email: row.email,
          pets: [],
        };
      }

      grouped[row.user_id].pets.push(row);
    });

    for (const userId in grouped) {
      const user = grouped[userId];

      try {
        await sendReminderEmail({
          to: user.email,
          subject: "🐾 PetCare Vaccination Reminder",
          html: buildEmailHTML(user.userName, user.pets),
        });

        console.log(`Reminder sent to ${user.email}`);
      } catch (mailErr) {
        console.log(`MAIL ERROR for ${user.email}:`, mailErr);
      }
    }
  });
}

module.exports = { sendVaccineReminders };