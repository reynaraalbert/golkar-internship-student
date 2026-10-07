import re

with open('src/lib/data.ts', 'r', encoding='utf-8') as f:
    code = f.read()

interface_replacement = '''export interface SiteContent {
  hero: HeroContent;
  statBar: StatBarContent;
  keunggulan: SectionHeader;
  lowongan: SectionHeader;
  tahapan: SectionHeader;
  syarat: SectionHeader;
  alumni: SectionHeader;
  berita: SectionHeader;
  faq: SectionHeader;
  kontak: KontakContent;
  medsos: MedsosContent;
  cta: CtaContent;
  footer: FooterContent;
  maps: MapsContent;
  announcement?: AnnouncementBar;
  navbarLink?: { label: string; url: string; };
}'''

code = re.sub(r'export interface SiteContent \{[\s\S]*?\n\}', interface_replacement, code)

obj_replacement = '''export const SiteContent: SiteContent = {
  hero: {
    badge: "GOLKAR INTERNSHIP STUDENT",
    title1: "Partai Golkar",
    title2: "GOLKAR INTERNSHIP STUDENT",
    subtitle: "Program Magang Mahasiswa",
    description: "Program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
    ctaPrimaryLabel: "Daftar Peserta",
    ctaPrimaryHref: "/anggota",
    ctaSecondaryLabel: "Lihat Program",
    ctaSecondaryHref: "/agenda",
    statuteQuote: "Membangun generasi muda Indonesia yang berkarakter, kompeten, dan berdedikasi.",
    statuteProgressLabel: "Program Internship",
    statuteProgressValue: "Aktif",
  },
  statBar: {
    value1: "1,500+", value2: "30+", value3: "98%", value4: "100+",
    label1: "Alumni Magang", label2: "Universitas Partner", label3: "Kepuasan Mentorship", label4: "Policy Brief Dihasilkan",
  },
  keunggulan: { title: "Keunggulan Magang", subtitle: "Kenapa memilih magang di Golkar Internship Student?" },
  lowongan: { title: "Lowongan Magang", subtitle: "Posisi yang tersedia untuk batch ini." },
  tahapan: { title: "Tahapan Seleksi", subtitle: "Alur proses penerimaan magang." },
  syarat: { title: "Syarat & Berkas Administrasi", subtitle: "Persyaratan umum untuk mendaftar." },
  alumni: { title: "Kata Alumni", subtitle: "Testimoni dari alumni Golkar Internship Student." },
  berita: { title: "Berita & Siaran Pers", subtitle: "Informasi terbaru seputar kegiatan magang." },
  faq: { title: "FAQ", subtitle: "Pertanyaan yang sering diajukan." },
  kontak: {
    serviceTitle: "Layanan Bantuan & Aspirasi",
    serviceHours: "Senin - Jumat, 08.00 - 16.00 WIB",
    email: "magang@fraksigolkar.com",
    mediaTitle: "Media & Publikasi",
    instagramHandle: "@fraksigolkar",
    youtubeLabel: "Fraksi Partai Golkar DPR RI",
    twitterHandle: "@fraksigolkar",
    websiteLabel: "fraksigolkar.com",
    aspirasiTitle: "Punya Aspirasi?",
    aspirasiDesc: "Sampaikan aspirasi, kritik, dan saran Anda melalui portal pengaduan resmi.",
    aspirasiCta: "Kirim Aspirasi",
  },
  medsos: { title: "Media Sosial", subtitle: "Ikuti aktivitas kami.", instagram: "https://instagram.com/fraksigolkar", twitter: "https://twitter.com/fraksigolkar", youtube: "https://youtube.com/fraksigolkar", facebook: "https://facebook.com/fraksigolkar" },
  cta: { title: "Siap Bergabung?", subtitle: "Tingkatkan kapasitas dirimu sekarang.", buttonText: "Daftar Peserta", buttonLink: "/user/login" },
  footer: {
    brandDescription: "Golkar Internship Student adalah program kolaborasi antara Fraksi Partai Golkar DPR RI dengan Universitas terbaik di Indonesia.",
    address: "Gedung Nusantara I Lt. 12\\nJl. Jenderal Gatot Subroto\\nJakarta Pusat, DKI Jakarta 10270",
    phone: "(021) 5715878",
    email: "sekretariat@fraksigolkar.com",
    transparencyText: "Fraksi Partai Golkar DPR RI berkomitmen untuk mewujudkan tata kelola organisasi yang transparan dan akuntabel sesuai dengan UU Keterbukaan Informasi Publik.",
    ppidText: "Layanan PPID tersedia untuk publikasi data.",
    copyrightText: "© Build by Reynara Albert Pradana. Hak Cipta Dilindungi Undang-Undang.",
  },
  maps: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4526001235123!2d106.79758711476906!3d-6.203998995508821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6ba89387a2d%3A0x64e8371ea3e80455!2sGedung%20Nusantara%20I%20DPR%2FRI!5e0!3m2!1sid!2sid!4v1652331599554!5m2!1sid!2sid",
    openUrl: "https://goo.gl/maps/QG2yQG2yQG2yQG2yQ",
    address: "Gedung Nusantara I Lt. 12\\nJl. Jenderal Gatot Subroto\\nJakarta Pusat, 10270",
    description: "Kantor Sekretariat Fraksi Partai Golkar DPR RI",
  },
  announcement: {
    badge: "INFO TERBARU",
    text: "Pendaftaran Golkar Internship Student Batch 6 telah dibuka!",
    ctaLabel: "Daftar Sekarang",
    ctaHref: "/user/login",
  },
  navbarLink: {
    label: "GOLKAR",
    url: "https://fraksigolkar.com/",
  },
};'''

code = re.sub(r'export const SiteContent: SiteContent = \{[\s\S]*?^};\n', obj_replacement + '\n', code, flags=re.MULTILINE)

with open('src/lib/data.ts', 'w', encoding='utf-8') as f:
    f.write(code)


with open('src/lib/defaults.ts', 'r', encoding='utf-8') as f:
    defs = f.read()

defs_replacement = '''export const EMPTY_SITECONTENT: SiteContent = {
  hero: {
    badge: "", title1: "", title2: "", subtitle: "", description: "",
    ctaPrimaryLabel: "", ctaPrimaryHref: "", ctaSecondaryLabel: "", ctaSecondaryHref: "",
    statuteQuote: "", statuteProgressLabel: "", statuteProgressValue: "",
  },
  statBar: { value1: "1,500+", value2: "30+", value3: "98%", value4: "100+", label1: "Alumni Magang", label2: "Universitas Partner", label3: "Kepuasan Mentorship", label4: "Policy Brief Dihasilkan" },
  keunggulan: { title: "Keunggulan Magang", subtitle: "Kenapa memilih magang di Golkar Internship Student?" },
  lowongan: { title: "Lowongan Magang", subtitle: "Posisi yang tersedia untuk batch ini." },
  tahapan: { title: "Tahapan Seleksi", subtitle: "Alur proses penerimaan magang." },
  syarat: { title: "Syarat & Berkas Administrasi", subtitle: "Persyaratan umum untuk mendaftar." },
  alumni: { title: "Kata Alumni", subtitle: "Testimoni dari alumni Golkar Internship Student." },
  berita: { title: "Berita & Siaran Pers", subtitle: "Informasi terbaru seputar kegiatan magang." },
  faq: { title: "FAQ", subtitle: "Pertanyaan yang sering diajukan." },
  kontak: {
    serviceTitle: "", serviceHours: "", email: "", mediaTitle: "", instagramHandle: "", youtubeLabel: "",
    twitterHandle: "", websiteLabel: "", aspirasiTitle: "", aspirasiDesc: "", aspirasiCta: "",
  },
  medsos: { title: "Media Sosial", subtitle: "Ikuti aktivitas kami.", instagram: "", twitter: "", youtube: "", facebook: "" },
  cta: { title: "Siap Bergabung?", subtitle: "Tingkatkan kapasitas dirimu sekarang.", buttonText: "Daftar Peserta", buttonLink: "/user/login" },
  footer: { brandDescription: "", address: "", phone: "", email: "", transparencyText: "", ppidText: "", copyrightText: "" },
  maps: { embedUrl: "", openUrl: "", address: "", description: "" },
  announcement: { badge: "INFO", text: "", ctaLabel: "Daftar Sekarang", ctaHref: "/user/login" },
  navbarLink: { label: "GOLKAR", url: "https://fraksigolkar.com/" },
};'''

defs = re.sub(r'export const EMPTY_SITECONTENT: SiteContent = \{[\s\S]*?\n\};\n', defs_replacement + '\n', defs)

with open('src/lib/defaults.ts', 'w', encoding='utf-8') as f:
    f.write(defs)


import os

pages = {
    'keunggulan': ('Target', 'Keunggulan Magang', 'keunggulan', 'keunggulan'),
    'lowongan': ('Briefcase', 'Lowongan Magang', 'lowongan magang', 'lowongan'),
    'tahapan': ('List', 'Tahapan Seleksi', 'tahapan', 'tahapan'),
    'syarat': ('FileText', 'Syarat Administrasi', 'syarat', 'syarat'),
    'alumni': ('MessageSquare', 'Kata Alumni', 'testimoni alumni', 'alumni'),
    'berita': ('Newspaper', 'Berita & Siaran Pers', 'berita di beranda', 'berita'),
    'faq': ('HelpCircle', 'FAQ', 'FAQ di beranda', 'faq'),
    'medsos': ('Radio', 'Media Sosial', 'link media sosial', 'medsos'),
    'cta': ('Megaphone', 'CTA (Siap Bergabung)', 'Call to Action', 'cta')
}

base_path = 'src/app/admin/(protected)/beranda'

for slug, (icon, title, subtitle, key) in pages.items():
    dir_path = os.path.join(base_path, slug)
    os.makedirs(dir_path, exist_ok=True)
    
    extra_fields = ''
    if key == 'medsos':
        extra_fields = """
        <Grid cols={2}>
          <Field label='Link Instagram'><Input value={data.medsos?.instagram || ''} onChange={e => update({ instagram: e.target.value })} className='w-full' /></Field>
          <Field label='Link Twitter'><Input value={data.medsos?.twitter || ''} onChange={e => update({ twitter: e.target.value })} className='w-full' /></Field>
          <Field label='Link YouTube'><Input value={data.medsos?.youtube || ''} onChange={e => update({ youtube: e.target.value })} className='w-full' /></Field>
          <Field label='Link Facebook'><Input value={data.medsos?.facebook || ''} onChange={e => update({ facebook: e.target.value })} className='w-full' /></Field>
        </Grid>"""
    elif key == 'cta':
        extra_fields = """
        <Grid cols={2}>
          <Field label='Teks Tombol'><Input value={data.cta?.buttonText || ''} onChange={e => update({ buttonText: e.target.value })} className='w-full' /></Field>
          <Field label='Link Tujuan'><Input value={data.cta?.buttonLink || ''} onChange={e => update({ buttonLink: e.target.value })} className='w-full' /></Field>
        </Grid>"""
        
    code_content = f"""\"use client\";
import React from \"react\";
import {{ {icon}, Info }} from \"lucide-react\";
import {{ SectionCard, Field, Input, SaveBar, PageHeader, Grid }} from \"@/components/admin/ui\";
import {{ useCollection }} from \"@/lib/admin-collection\";
import {{ EMPTY_SITECONTENT }} from \"@/lib/defaults\";

export default function AdminBeranda{slug.capitalize()}Page() {{
  const {{ data, setData, save, saving, saved, loaded }} = useCollection(\"siteContent\", EMPTY_SITECONTENT);
  if (!loaded) return <div className=\"flex items-center justify-center py-24\">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({{ ...p, {key}: {{ ...(p.{key} || {{}}), ...patch }} }}));

  return (
    <div className=\"space-y-8 pb-24\">
      <PageHeader icon={{{icon}}} title=\"Edit Header {title}\" subtitle=\"Ubah judul dan subjudul section {subtitle}.\" />
      <SectionCard icon={{{icon}}} title=\"Header Section {title}\" description=\"Teks header bagian {title}.\">
        <Field label=\"Judul Utama\"><Input value={{data.{key}?.title || ''}} onChange={{e => update({{ title: e.target.value }})}} className=\"w-full\" /></Field>
        <Field label=\"Sub Judul\"><Input value={{data.{key}?.subtitle || ''}} onChange={{e => update({{ subtitle: e.target.value }})}} className=\"w-full\" /></Field>
        {extra_fields}
      </SectionCard>
      <SaveBar saving={{saving}} saved={{saved}} onSave={{save}} />
    </div>
  );
}}
"""
    with open(os.path.join(dir_path, 'page.tsx'), 'w', encoding='utf-8') as f:
        f.write(code_content)
