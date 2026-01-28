/**
 * HTML formatters for chatbot responses
 * Dark-theme styled cards for displaying data
 */

export const formatEvents = (events) => {
  if (!events?.length) return '<p>No upcoming events.</p>';
  
  return events
    .map(
      (e) => `
<div style="border:1px solid #2e86de; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#1b2a41;">
  <h4 style="margin:0; color:#54a0ff;">📅 ${e.title || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    <strong>Type:</strong> ${e.type || '-'}<br>
    <strong>Date:</strong> ${e.date || '-'}<br>
    <strong>Organizer:</strong> ${e.organizer || '-'}<br>
    ${e.description || '-'}
  </p>
</div>`
    )
    .join('');
};

export const formatFundraising = (fundraising) => {
  if (!fundraising?.length) return '<p>No fundraising campaigns.</p>';
  
  return fundraising
    .map(
      (f) => `
<div style="border:1px solid #00b894; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#1e2d24;">
  <h4 style="margin:0; color:#00cec9;">💰 ${f.title || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    <strong>Raised:</strong> ${f.raised || '0'} / ${f.goal || '0'}<br>
    <strong>Purpose:</strong> ${f.purpose || '-'}<br>
    <strong>Deadline:</strong> ${f.deadline || '-'}
  </p>
</div>`
    )
    .join('');
};

export const formatInternships = (internships) => {
  if (!internships?.length) return '<p>No internships available.</p>';
  
  return internships
    .map(
      (i) => `
<div style="border:1px solid #fdcb6e; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#3e2d1f;">
  <h4 style="margin:0; color:#ffeaa7;">💼 ${i.title || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    <strong>Company:</strong> ${i.company || '-'}<br>
    <strong>Duration:</strong> ${i.duration || '-'}<br>
    ${i.description || '-'}
  </p>
</div>`
    )
    .join('');
};

export const formatNotifications = (notifications) => {
  if (!notifications?.length) return '<p>No notifications.</p>';
  
  return notifications
    .map(
      (n) => `
<div style="border:1px solid #636e72; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#2d3436;">
  <h4 style="margin:0; color:#b2bec3;">🔔 ${n.title || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    ${n.message || '-'}<br>
    <strong>Date:</strong> ${n.date || '-'}
  </p>
</div>`
    )
    .join('');
};

export const formatMentorship = (mentorships) => {
  if (!mentorships?.length) return '<p>No mentorship programs.</p>';
  
  return mentorships
    .map(
      (m) => `
<div style="border:1px solid #6c5ce7; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#2b1e4a;">
  <h4 style="margin:0; color:#a29bfe;">🧑‍🏫 ${m.mentorName || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    <strong>Expertise:</strong> ${m.expertise || '-'}<br>
    <strong>Contact:</strong> ${m.contact || '-'}
  </p>
</div>`
    )
    .join('');
};

export const formatDirectory = (users) => {
  if (!users?.length) return '<p>No alumni directory data.</p>';
  
  return users
    .map(
      (u) => `
<div style="border:1px solid #00cec9; border-radius:10px; padding:10px; margin-bottom:10px; background-color:#1e3c3c;">
  <h4 style="margin:0; color:#81ecec;">🎓 ${u.name || '-'}</h4>
  <p style="margin:5px 0; color:#dfe6e9;">
    <strong>Role:</strong> ${u.role || '-'}<br>
    <strong>College:</strong> ${u.college || '-'}<br>
    <strong>Profession:</strong> ${u.profession || '-'}<br>
    <strong>Batch:</strong> ${u.batch || '-'}<br>
    <strong>Grad Year:</strong> ${u.gradYear || '-'}<br>
    <strong>Company:</strong> ${u.company || '-'}<br>
    <strong>City:</strong> ${u.city || '-'}<br>
    <strong>Email:</strong> ${u.email || '-'}
  </p>
</div>`
    )
    .join('');
};

/**
 * Build complete context for AI
 */
export const buildContext = (data) => {
  const {
    events = [],
    fundraising = [],
    internships = [],
    notifications = [],
    mentorships = [],
    users = [],
  } = data;

  return `
<h2>📢 Alumni Dashboard</h2>

<h3>📅 Events:</h3>
${formatEvents(events)}

<h3>💰 Fundraising:</h3>
${formatFundraising(fundraising)}

<h3>💼 Internships:</h3>
${formatInternships(internships)}

<h3>🔔 Notifications:</h3>
${formatNotifications(notifications)}

<h3>🧑‍🏫 Mentorship Programs:</h3>
${formatMentorship(mentorships)}

<h3>🎓 Alumni Directory:</h3>
${formatDirectory(users)}
`;
};
