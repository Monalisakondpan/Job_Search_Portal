import nodemailer from "nodemailer";
import { escapeHtml } from "./sanitize.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"CareerForge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
};

// Shared style block to keep templates consistent and short.
const baseStyle = `
    body { font-family: 'Segoe UI', sans-serif; background:#f4f4f8; margin:0; padding:0; }
    .wrapper { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 30px rgba(0,0,0,0.08); }
    .header { padding:40px 32px; text-align:center; }
    .header h1 { color:#fff; font-size:24px; margin:0; font-weight:700; }
    .header p { color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px; }
    .body { padding:32px; }
    .body h2 { font-size:20px; color:#1a1a24; margin:0 0 12px; }
    .body p { font-size:15px; color:#555; line-height:1.6; }
    .highlight { background:#F7ECE6; border-left:4px solid #C2754B; border-radius:6px; padding:16px 20px; margin:24px 0; }
    .highlight p { margin:4px 0; color:#333; font-size:14px; }
    .highlight p span { font-weight:600; color:#C2754B; }
    .btn { display:inline-block; background:linear-gradient(135deg,#C2754B,#DE9C72); color:#fff; text-decoration:none; padding:14px 28px; border-radius:50px; font-size:15px; font-weight:600; margin:20px 0; }
    .note { font-size:13px; color:#999; margin-top:20px; }
    .footer { text-align:center; padding:20px 32px; background:#f8f8fb; font-size:12px; color:#aaa; }
`;

export const applicationSubmittedEmailHtml = ({ applicantName, jobTitle, companyName }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#C1473D); }</style></head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Application Received! 🎉</h1>
      <p>Your journey begins here</p>
    </div>
    <div class="body">
      <h2>Hi ${escapeHtml(applicantName)},</h2>
      <p>Your application has been successfully submitted! Our team will review your profile and get back to you soon.</p>
      <div class="highlight">
        <p>Position: <span>${escapeHtml(jobTitle)}</span></p>
        <p>Company: <span>${escapeHtml(companyName) || "Listed Employer"}</span></p>
        <p>Status: <span>Under Review ✅</span></p>
      </div>
      <p>Keep exploring opportunities on our platform. The right job is just a click away.</p>
      <a class="btn" href="${process.env.FRONTEND_URL}/applications/me">View My Applications</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;

export const newApplicantEmailHtml = ({ employerName, applicantName, jobTitle, applicantEmail }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#6FA66B); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>New Application Alert! 📬</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(employerName)},</h2>
      <p>You received a new application for one of your job postings:</p>
      <div class="highlight">
        <p>Applicant: <span>${escapeHtml(applicantName)}</span></p>
        <p>Email: <span>${escapeHtml(applicantEmail)}</span></p>
        <p>Applied For: <span>${escapeHtml(jobTitle)}</span></p>
      </div>
      <p>Log in to your dashboard to review the application and resume.</p>
      <a class="btn" href="${process.env.FRONTEND_URL}/applications/me">Review Application</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;

export const resetPasswordEmailHtml = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#C1473D); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Password Reset Request 🔐</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(name)},</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
      <a class="btn" href="${resetUrl}">Reset Password</a>
      <p class="note">If you didn't request this, you can safely ignore this email — your password won't change unless you click the link above and set a new one.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;

export const statusChangeEmailHtml = ({ applicantName, jobTitle, status }) => {
  const statusCopy = {
    "Under Review": { emoji: "👀", line: "Your application is now being reviewed by the hiring team." },
    "Shortlisted": { emoji: "✨", line: "Good news — you've been shortlisted for this role!" },
    "Interview Scheduled": { emoji: "📅", line: "You're being scheduled for an interview. The employer will reach out with details." },
    "Selected": { emoji: "🎉", line: "Congratulations — you've been selected for this position!" },
    "Rejected": { emoji: "📋", line: "The employer has decided to move forward with other candidates this time." },
    "Applied": { emoji: "📨", line: "Your application status has been updated." },
  };
  const { emoji, line } = statusCopy[status] || statusCopy["Applied"];

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#C1473D); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Application Update ${emoji}</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(applicantName)},</h2>
      <p>${line}</p>
      <div class="highlight">
        <p>Position: <span>${escapeHtml(jobTitle)}</span></p>
        <p>New Status: <span>${escapeHtml(status)}</span></p>
      </div>
      <a class="btn" href="${process.env.FRONTEND_URL}/applications/me">View My Applications</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;
};

// ---- WELCOME EMAIL (new user on register) ----
export const welcomeEmailHtml = ({ name, role }) => {
  const isEmployer = role === "Employer";
  const intro = isEmployer
    ? "Your employer account is ready. Start posting jobs and find the right talent for your team."
    : "Your account is ready. Start exploring jobs and apply to the ones that fit your future.";
  const ctaText = isEmployer ? "Post a Job" : "Browse Jobs";
  const ctaLink = isEmployer ? `${process.env.FRONTEND_URL}/job/post` : `${process.env.FRONTEND_URL}/jobs`;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#C1473D); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Welcome to CareerForge! 🎉</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(name)},</h2>
      <p>${intro}</p>
      <a class="btn" href="${ctaLink}">${ctaText}</a>
      <p>We're glad to have you on board.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;
};

// ---- ACCOUNT DELETED EMAIL (user deletes own account) ----
export const accountDeletedEmailHtml = ({ name }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#1a1a24,#C1473D); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Account Deleted</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(name)},</h2>
      <p>Your CareerForge account has been deleted, and your data removed. We're sorry to see you go.</p>
      <p>If this wasn't you, please contact our support team right away.</p>
      <p class="note">You're always welcome back — just register again anytime.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;

// ---- JOB POSTED EMAIL (employer posts a job) ----
export const jobPostedEmailHtml = ({ employerName, jobTitle, city, country }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#C2754B,#6FA66B); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Your Job is Live! 🚀</h1></div>
    <div class="body">
      <h2>Hi ${escapeHtml(employerName)},</h2>
      <p>Your job posting is now live on CareerForge and visible to job seekers.</p>
      <div class="highlight">
        <p>Title: <span>${escapeHtml(jobTitle)}</span></p>
        <p>Location: <span>${escapeHtml(city)}, ${escapeHtml(country)}</span></p>
      </div>
      <a class="btn" href="${process.env.FRONTEND_URL}/job/me">View My Jobs</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · All rights reserved</div>
  </div>
</body>
</html>
`;

// ---- ADMIN NOTIFICATION TEMPLATE ----
export const adminNotifyEmailHtml = ({ title, lines }) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><style>${baseStyle} .header { background:linear-gradient(135deg,#1a1a24,#C2754B); }</style></head>
<body>
  <div class="wrapper">
    <div class="header"><h1>${escapeHtml(title)}</h1></div>
    <div class="body">
      <p>Admin alert — new activity on CareerForge:</p>
      <div class="highlight">
        ${lines.map((l) => `<p>${escapeHtml(l.label)}: <span>${escapeHtml(l.value)}</span></p>`).join("")}
      </div>
      <p>Log in to the admin dashboard for full details.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CareerForge · Admin Notification</div>
  </div>
</body>
</html>
`;

// ---- ADMIN NOTIFY HELPER ----
export const notifyAdmin = async ({ title, subject, lines }) => {
  try {
    const { User } = await import("../models/userSchema.js");
    const admin = await User.findOne({ role: "Admin" });
    if (!admin || !admin.email) {
      console.warn("notifyAdmin: no Admin user found, skipping alert.");
      return;
    }
    await sendEmail({
      to: admin.email,
      subject,
      html: adminNotifyEmailHtml({ title, lines }),
    });
  } catch (err) {
    console.error("notifyAdmin failed:", err.message);
  }
};