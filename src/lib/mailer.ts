import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset Kata Sandi – Golkar Internship Student</title>
</head>
<body style="margin:0;padding:0;background:#0A111E;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" style="max-width:560px;width:100%;background:#111B2E;border-radius:16px;border:1px solid rgba(212,175,55,0.2);overflow:hidden;">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2744 0%,#0D1626 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(212,175,55,0.2);">
              <div style="display:inline-block;background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.35);border-radius:999px;padding:4px 16px;margin-bottom:16px;">
                <span style="color:#F5C518;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">Golkar Internship Student</span>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;">Reset Kata Sandi</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#94A3B8;">Portal Resmi Pendaftaran &amp; Pembinaan Magang</p>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 12px;font-size:14px;color:#CBD5E1;">Halo, <strong style="color:#F1F5F9;">${escapeHtml(name)}</strong>,</p>
              <p style="margin:0 0 24px;font-size:14px;color:#94A3B8;line-height:1.7;">
                Kami menerima permintaan untuk mereset kata sandi akun portal magang Anda. Klik tombol di bawah ini untuk membuat kata sandi baru.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#F5C518,#D4AF37);color:#0A111E;font-weight:900;font-size:14px;text-decoration:none;padding:14px 36px;border-radius:999px;letter-spacing:0.3px;box-shadow:0 4px 20px rgba(245,197,24,0.35);">
                   &nbsp;Reset Kata Sandi Sekarang
                </a>
              </div>
              <p style="margin:24px 0 0;font-size:12px;color:#64748B;line-height:1.7;">
                Tautan ini hanya berlaku selama <strong style="color:#94A3B8;">1 jam</strong> dan hanya dapat digunakan sekali.<br/>
                Jika Anda tidak meminta reset kata sandi, abaikan email ini — akun Anda tetap aman.
              </p>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;" />
              <p style="margin:0;font-size:11px;color:#475569;line-height:1.7;">
                Tautan alternatif (salin ke browser jika tombol tidak berfungsi):<br/>
                <span style="color:#F5C518;word-break:break-all;">${resetUrl}</span>
              </p>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background:#0D1626;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.07);">
              <p style="margin:0;font-size:11px;color:#475569;">
                © ${new Date().getFullYear()} Golkar Internship Student · Fraksi Partai Golkar DPR RI<br/>
                Gedung Nusantara I Lt. 12, Jl. Jend. Gatot Subroto, Jakarta Pusat
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Golkar Internship Student <onboarding@resend.dev>",
    to,
    subject: "Reset Kata Sandi – Golkar Internship Student",
    html,
  });
}


