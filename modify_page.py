import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

replacements = {
    '<span>MENGAPA MEMILIH GOLKAR INTERNSHIP STUDENT</span>': '<span>{siteContent.keunggulan?.subtitle || "MENGAPA MEMILIH GOLKAR INTERNSHIP STUDENT"}</span>',
    'Keunggulan Utama Program Magang GIS': '{siteContent.keunggulan?.title || "Keunggulan Utama Program Magang GIS"}',
    
    '<span>KATEGORI & POSISI MAGANG</span>': '<span>{siteContent.lowongan?.subtitle || "KATEGORI & POSISI MAGANG"}</span>',
    'Jalur Penerimaan Magang Tersedia': '{siteContent.lowongan?.title || "Jalur Penerimaan Magang Tersedia"}',
    
    '<span>ALUR PENDAFTARAN & SELEKSI</span>': '<span>{siteContent.tahapan?.subtitle || "ALUR PENDAFTARAN & SELEKSI"}</span>',
    'Tahapan Penerimaan Peserta Magang GIS': '{siteContent.tahapan?.title || "Tahapan Penerimaan Peserta Magang GIS"}',
    
    '<span>PERSYARATAN UMUM & DOKUMEN</span>': '<span>{siteContent.syarat?.subtitle || "PERSYARATAN UMUM & DOKUMEN"}</span>',
    'Syarat Administrasi Magang GIS': '{siteContent.syarat?.title || "Syarat Administrasi Magang GIS"}',
    
    '<span>TESTIMONIAL ALUMNI</span>': '<span>{siteContent.alumni?.subtitle || "TESTIMONIAL ALUMNI"}</span>',
    'Apa Kata Mereka Tentang GIS?': '{siteContent.alumni?.title || "Apa Kata Mereka Tentang GIS?"}',
    
    '<span>INFORMASI PERTANYAAN</span>': '<span>{siteContent.faq?.subtitle || "INFORMASI PERTANYAAN"}</span>',
    'Pertanyaan Yang Sering Diajukan (FAQ)': '{siteContent.faq?.title || "Pertanyaan Yang Sering Diajukan (FAQ)"}',
    
    '<span>{kontak.mediaTitle}</span>': '<span>{siteContent.medsos?.title || kontak.mediaTitle}</span>',
    'href="https://instagram.com/dpr_ri"': 'href={siteContent.medsos?.instagram || "https://instagram.com/dpr_ri"}',
    'href="https://youtube.com/@DPRRIOfficial"': 'href={siteContent.medsos?.youtube || "https://youtube.com/@DPRRIOfficial"}',
    'href="https://x.com/DPR_RI"': 'href={siteContent.medsos?.twitter || "https://x.com/DPR_RI"}',
    'href="https://www.dpr.go.id"': 'href={siteContent.medsos?.facebook || "https://www.dpr.go.id"}',
    
    'SIAP BERGABUNG DENGAN GIS?': '{siteContent.cta?.title || "SIAP BERGABUNG DENGAN GIS?"}',
    'Daftarkan diri Anda sekarang & raih pengalaman publik terbaik!': '{siteContent.cta?.subtitle || "Daftarkan diri Anda sekarang & raih pengalaman publik terbaik!"}',
    '<span>Daftar Akun</span>': '<span>{siteContent.cta?.buttonText || "Daftar Akun"}</span>',
    'href="/user/login"': 'href={siteContent.cta?.buttonLink || "/user/login"}'
}

for old_str, new_str in replacements.items():
    code = code.replace(old_str, new_str)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
