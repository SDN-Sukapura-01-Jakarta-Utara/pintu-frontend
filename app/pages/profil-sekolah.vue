<template>
  <div class="font-poppins bg-white overflow-x-hidden">

    <!-- ===== NAVBAR ===== -->
    <PublicNavbar />

    <!-- ===== HERO ===== -->
    <section class="relative h-[40vh] min-h-[320px] max-h-[400px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=600&fit=crop" 
          alt="Profil Sekolah" 
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center">
        <div class="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-4 animate-fadeInUp">
            <a href="/" class="hover:text-yellow-400 transition-colors">
              <i class="fas fa-home"></i> Beranda
            </a>
            <i class="fas fa-chevron-right text-[10px]"></i>
            <span class="text-white">Profil Sekolah</span>
          </div>

          <!-- Title & Description -->
          <div class="max-w-2xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
              Profil <span class="text-yellow-400">Sekolah</span>
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed animate-fadeInUp animation-delay-200">
              Mengenal lebih dekat SDN Sukapura 01, lembaga pendidikan yang berkomitmen mencetak generasi unggul, berkarakter, dan berprestasi.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Curve -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="w-full h-8 sm:h-12 block">
          <path fill="white" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z"></path>
        </svg>
      </div>
    </section>

    <!-- KEPALA SEKOLAH -->
    <section class="kepsek-section">
      <div class="section-inner">
        <div class="section-header reveal" data-delay="0">
          <div class="section-eyebrow">Sambutan</div>
          <h2 class="section-title crimson-text">Kata Kepala Sekolah</h2>
        </div>

        <div v-if="kutipanKepsekData" class="kepsek-card reveal" data-delay="100">
          <div class="kepsek-foto-col">
            <div class="foto-wrapper">
              <img
                :src="kutipanKepsekData.foto_kepsek || 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop&crop=face'"
                alt="Kepala Sekolah"
                class="foto-kepsek"
              >
              <div class="foto-badge">Kepala Sekolah</div>
            </div>
          </div>

          <div class="kepsek-content-col">
            <div class="relative">
              <i class="fas fa-quote-left text-4xl text-red-600/20 absolute -top-2 -left-2"></i>
              <div class="kepsek-body relative z-10 pl-6" v-html="kutipanKepsekData.kutipan_kepsek"></div>
            </div>

            <div class="kepsek-footer">
              <div class="kepsek-avatar">{{ getInitials(kutipanKepsekData.nama_kepsek) }}</div>
              <div>
                <div class="kepsek-footer-name">{{ kutipanKepsekData.nama_kepsek }}</div>
                <div class="kepsek-footer-role">Kepala SDN Sukapura 01</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else-if="loadingKepsek" class="kepsek-card reveal" data-delay="100">
          <div class="text-center py-12 text-gray-500 w-full">
            <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
            <p>Memuat data kutipan kepala sekolah...</p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="errorKepsek" class="kepsek-card reveal" data-delay="100">
          <div class="text-center py-12 text-red-500 w-full">
            <i class="fas fa-exclamation-circle text-3xl mb-3"></i>
            <p>Gagal memuat data kutipan kepala sekolah</p>
            <p class="text-xs mt-2">{{ errorKepsek.message }}</p>
          </div>
        </div>

        <!-- No data state -->
        <div v-else class="kepsek-card reveal" data-delay="100">
          <div class="text-center py-12 text-gray-500 w-full">
            <i class="fas fa-info-circle text-3xl mb-3"></i>
            <p>Data kutipan kepala sekolah belum tersedia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- VISI MISI -->
    <section id="visimisi" class="visimisi-section">
      <div class="section-inner">
        <div class="section-header reveal" data-delay="0">
          <div class="section-eyebrow">Arah &amp; Tujuan</div>
          <h2 class="section-title crimson-text">Visi &amp; Misi Sekolah</h2>
        </div>

        <div v-if="visiMisiData" class="visimisi-grid">
          <!-- Visi -->
          <div class="visi-card reveal" data-delay="100">
            <div class="vm-icon-wrapper">
              <i class="fas fa-eye gold-icon" />
            </div>
            <div class="vm-eyebrow">Visi Sekolah</div>
            <h3 class="vm-title">Visi Kami</h3>
            <div class="visi-quote-box">
              <div v-html="visiMisiData.visi"></div>
            </div>
          </div>

          <!-- Misi -->
          <div class="misi-card reveal" data-delay="200">
            <div class="vm-icon-wrapper">
              <i class="fas fa-bullseye gold-icon" />
            </div>
            <div class="vm-eyebrow">Misi Sekolah</div>
            <h3 class="vm-title">Misi Kami</h3>
            <div class="misi-list-wrapper" v-html="visiMisiData.misi"></div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12 text-gray-500">
          <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
          <p>Memuat data visi misi...</p>
        </div>
      </div>
    </section>

    <!-- SARANA PRASARANA -->
    <section id="sarpras" class="sarpras-section">
      <div class="section-inner">
        <div class="section-header reveal" data-delay="0">
          <div class="section-eyebrow">Fasilitas</div>
          <h2 class="section-title crimson-text">Sarana &amp; Prasarana</h2>
          <p class="section-desc">Fasilitas lengkap dan modern untuk mendukung proses belajar mengajar yang optimal</p>
        </div>

        <div v-if="sarprasData && sarprasData.length > 0" class="sarpras-carousel-wrapper">
          <!-- Row 1: Scroll Left to Right -->
          <div class="sarpras-scroll-row">
            <div class="sarpras-scroll-track scroll-ltr">
              <div
                v-for="(item, i) in [...sarprasData, ...sarprasData, ...sarprasData]"
                :key="`ltr-${i}`"
                class="sarpras-card-scroll"
                @click="openSarprasModal(item)"
              >
                <img :src="item.foto" :alt="item.name" class="sarpras-img-scroll">
                <div class="sarpras-overlay-scroll">
                  <div class="sarpras-nama-scroll">{{ item.name }}</div>
                </div>
                <div class="sarpras-zoom-icon">
                  <i class="fas fa-search-plus"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: Scroll Right to Left -->
          <div class="sarpras-scroll-row">
            <div class="sarpras-scroll-track scroll-rtl">
              <div
                v-for="(item, i) in [...sarprasData, ...sarprasData, ...sarprasData]"
                :key="`rtl-${i}`"
                class="sarpras-card-scroll"
                @click="openSarprasModal(item)"
              >
                <img :src="item.foto" :alt="item.name" class="sarpras-img-scroll">
                <div class="sarpras-overlay-scroll">
                  <div class="sarpras-nama-scroll">{{ item.name }}</div>
                </div>
                <div class="sarpras-zoom-icon">
                  <i class="fas fa-search-plus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12 text-gray-500">
          <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
          <p>Memuat data sarana prasarana...</p>
        </div>
      </div>
    </section>

    <!-- Sarpras Modal -->
    <Transition name="modal-fade">
      <div v-if="showSarprasModal" class="sarpras-modal-overlay" @click="closeSarprasModal">
        <div class="sarpras-modal-content" @click.stop>
          <button class="sarpras-modal-close" @click="closeSarprasModal">
            <i class="fas fa-times"></i>
          </button>
          <img v-if="selectedSarpras" :src="selectedSarpras.foto" :alt="selectedSarpras.name" class="sarpras-modal-img">
          <div class="sarpras-modal-title">{{ selectedSarpras?.name }}</div>
        </div>
      </div>
    </Transition>

    <!-- STRUKTUR ORGANISASI -->
    <section id="struktur" class="struktur-section">
      <div class="section-inner">
        <div class="section-header reveal" data-delay="0">
          <div class="section-eyebrow">Organisasi</div>
          <h2 class="section-title crimson-text">Struktur Organisasi</h2>
        </div>

        <div class="struktur-wrapper reveal" data-delay="100">
          <div class="org-chart">

            <!-- Row 1: Kepala Sekolah -->
            <div class="org-row">
              <div class="org-box box-crimson">
                <div class="org-jabatan">Kepala Sekolah</div>
                <div class="org-nama">Dra. Hj. Sri Wulandari</div>
              </div>
            </div>

            <div class="org-connector-v" />

            <!-- Row 2: Komite & Wakasek -->
            <div class="org-row org-row-multi">
              <div class="org-h-line" />
              <div class="org-box box-gold">
                <div class="org-jabatan dark-text">Komite Sekolah</div>
                <div class="org-nama dark-text">Drs. Ahmad Yani</div>
              </div>
              <div class="org-box box-dark">
                <div class="org-jabatan">Wakil Kepala</div>
                <div class="org-nama">Budi Santoso, S.Pd</div>
              </div>
            </div>

            <div class="org-connector-v" />

            <!-- Row 3: Tata Usaha -->
            <div class="org-row">
              <div class="org-box box-blue">
                <div class="org-jabatan">Tata Usaha</div>
                <div class="org-nama">Siti Rahayu, A.Md</div>
              </div>
            </div>

            <div class="org-connector-v" />
            <div class="org-h-line-full" />

            <!-- Row 4: Guru-guru -->
            <div class="org-row org-row-multi guru-row">
              <div v-for="guru in guruData" :key="guru.nama" class="org-box" :class="guru.boxClass">
                <div class="org-jabatan">{{ guru.jabatan }}</div>
                <div class="org-nama">{{ guru.nama }}</div>
              </div>
            </div>

            <div class="org-connector-v" />

            <!-- Row 5: Siswa -->
            <div class="org-row">
              <div class="org-box box-red">
                <div class="org-jabatan">Peserta Didik</div>
                <div class="org-nama">487 Siswa — Kelas 1 s/d 6</div>
              </div>
            </div>

          </div>

          <!-- Keterangan -->
          <div class="org-legend">
            <div class="legend-item">
              <div class="legend-line solid" />
              <span>Garis Komando</span>
            </div>
            <div class="legend-item">
              <div class="legend-line dashed" />
              <span>Garis Koordinasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <PublicFooter :kontakData="kontakDataFromAPI" />

    <!-- Back to Top -->
    <Transition name="fade">
      <button
        v-show="scrolled"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white border-none cursor-pointer flex items-center justify-center shadow-xl z-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style="background: linear-gradient(135deg, #8B0000, #DC143C);"
      >
        <i class="fas fa-chevron-up"></i>
      </button>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getPublicDataKontak, getPublicKutipanKepsek, getPublicVisiMisi, getPublicSarpras } from '~/services/public-home'

// ----- DATA -----
const scrolled = ref(false)
const kontakDataFromAPI = ref(null)
const selectedSarpras = ref(null)
const showSarprasModal = ref(false)

const openSarprasModal = (item) => {
  selectedSarpras.value = item
  showSarprasModal.value = true
}

const closeSarprasModal = () => {
  showSarprasModal.value = false
  selectedSarpras.value = null
}

// Fetch kutipan kepsek using useAsyncData
const { data: kutipanKepsekData, pending: loadingKepsek, error: errorKepsek } = await useAsyncData(
  'kutipan-kepsek',
  async () => {
    try {
      const response = await getPublicKutipanKepsek()
      console.log('Kutipan kepsek response:', response)
      return response?.data || null
    } catch (error) {
      console.error('Error in useAsyncData:', error)
      return null
    }
  }
)

// Fetch visi misi using useAsyncData
const { data: visiMisiData, pending: loadingVisiMisi, error: errorVisiMisi } = await useAsyncData(
  'visi-misi',
  async () => {
    try {
      const response = await getPublicVisiMisi()
      console.log('Visi misi response:', response)
      return response?.data || null
    } catch (error) {
      console.error('Error fetching visi misi:', error)
      return null
    }
  }
)

// Fetch sarpras using useAsyncData
const { data: sarprasData, pending: loadingSarpras, error: errorSarpras } = await useAsyncData(
  'sarpras',
  async () => {
    try {
      const response = await getPublicSarpras()
      console.log('Sarpras response:', response)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching sarpras:', error)
      return []
    }
  }
)

const guruData = [
  { jabatan: 'Guru Kls 1', nama: 'Dewi Lestari, S.Pd',   boxClass: 'box-green' },
  { jabatan: 'Guru Kls 2', nama: 'Hendra Kusuma, S.Pd',  boxClass: 'box-green' },
  { jabatan: 'Guru Kls 3', nama: 'Rina Fitriani, S.Pd',  boxClass: 'box-green' },
  { jabatan: 'Guru PAI',   nama: 'Ustaz Fajar, S.Ag',    boxClass: 'box-purple' },
  { jabatan: 'Guru PJOK',  nama: 'Rizky Pratama, S.Pd',  boxClass: 'box-purple' },
]

// ----- LOGIC -----
const handleScroll = () => {
  scrolled.value = window.scrollY > 100
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Get initials from name
const getInitials = (name) => {
  if (!name) return 'KS'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Intersection Observer for reveal
let revealObserver = null

// Fetch data kontak
const fetchKontakData = async () => {
  try {
    const response = await getPublicDataKontak()
    if (response) {
      kontakDataFromAPI.value = response
    }
  } catch (error) {
    console.error('Error fetching kontak data:', error)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Fetch data kontak
  fetchKontakData()

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0
        setTimeout(() => entry.target.classList.add('visible'), +delay)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  revealObserver?.disconnect()
})
</script>

<style scoped>
/* ─── BASE ─────────────────────────────────────────────────── */
.font-poppins {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
}

/* ─── HERO ──────────────────────────────────────────────────── */
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animation-delay-100 {
  animation-delay: 0.1s;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── SHARED SECTION STYLES ─────────────────────────────────── */
.section-inner { max-width: 1280px; margin: 0 auto; padding: 80px 24px; }
.section-header { text-align: center; margin-bottom: 56px; }
.section-eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: #DC143C; margin-bottom: 12px;
}
.section-eyebrow::before, .section-eyebrow::after {
  content: ''; flex: 0 0 32px; height: 1px; background: #DC143C; opacity: 0.35;
}
.gold-eyebrow { color: #FFD700; }
.gold-eyebrow::before, .gold-eyebrow::after { background: #FFD700; }

.section-title {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(24px, 4vw, 36px); line-height: 1.2; font-weight: 700;
}
.crimson-text { color: #8B0000; }
.white-text   { color: white; }
.section-desc { color: #666; margin-top: 14px; max-width: 500px; margin-left: auto; margin-right: auto; }

/* ─── KEPALA SEKOLAH ─────────────────────────────────────────── */
.kepsek-section { background: white; }
.kepsek-card {
  background: white; border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  padding: 56px;
  display: grid; grid-template-columns: 320px 1fr; gap: 56px; align-items: start;
}
@media (max-width: 900px) { .kepsek-card { grid-template-columns: 1fr; padding: 32px; } }

.kepsek-foto-col { display: flex; flex-direction: column; align-items: center; }
.foto-wrapper { position: relative; display: inline-block; margin-bottom: 40px; }
.foto-wrapper::after {
  content: ''; position: absolute; inset: -8px; border-radius: 20px;
  background: linear-gradient(135deg, #DC143C, #FFD700); z-index: -1;
}
.foto-kepsek { width: 260px; height: 340px; object-fit: cover; border-radius: 16px; display: block; }
.foto-badge {
  position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #8B0000, #DC143C);
  color: white; padding: 10px 28px; border-radius: 9999px;
  font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  white-space: nowrap; box-shadow: 0 8px 24px rgba(139,0,0,0.35);
}
.kepsek-identity { text-align: center; margin-top: 8px; }
.kepsek-nama { font-weight: 700; font-size: 18px; color: #111; margin-bottom: 4px; }
.kepsek-nip { font-size: 13px; color: #999; margin-bottom: 10px; }
.kepsek-degree {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; color: #555; background: #f5f5f5; padding: 6px 14px; border-radius: 9999px;
}

.kepsek-content-col { display: flex; flex-direction: column; gap: 20px; }

.kepsek-body { color: #555; line-height: 1.8; font-size: 15px; }
.kepsek-body p { margin-bottom: 16px; }
.kepsek-body p:last-child { margin-bottom: 0; }

.kepsek-footer {
  display: flex; align-items: center; gap: 16px;
  padding-top: 20px; border-top: 1px solid #f0f0f0; margin-top: 4px;
}
.kepsek-avatar {
  width: 48px; height: 48px; border-radius: 9999px;
  background: linear-gradient(135deg, #8B0000, #DC143C);
  color: white; font-weight: 700; font-size: 16px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.kepsek-footer-name { font-weight: 700; color: #111; font-size: 15px; }
.kepsek-footer-role { color: #DC143C; font-size: 13px; margin-top: 2px; }

/* ─── VISI MISI ──────────────────────────────────────────────── */
.visimisi-section { 
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
  padding: 60px 0 80px 0;
}
.visimisi-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 32px; 
}
@media (max-width: 768px) { 
  .visimisi-grid { 
    grid-template-columns: 1fr; 
  } 
}

.visi-card, .misi-card {
  border-radius: 24px; 
  padding: 48px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}
.visi-card::before, .misi-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  transform: translate(50%, -50%);
}
.visi-card:hover, .misi-card:hover {
  transform: translateY(-8px); 
  box-shadow: 0 28px 70px rgba(0,0,0,0.18);
}
.visi-card { 
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); 
}
.misi-card { 
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
}

.vm-icon-wrapper {
  width: 64px; 
  height: 64px; 
  border-radius: 18px;
  background: rgba(255,255,255,0.15);
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-size: 28px; 
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}
.gold-icon {
  color: #FFD700;
}
.vm-eyebrow {
  font-size: 12px; 
  font-weight: 700; 
  letter-spacing: 2.5px; 
  text-transform: uppercase;
  color: rgba(255,215,0,0.85); 
  margin-bottom: 10px;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  position: relative;
  z-index: 1;
}
.vm-title {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  font-size: 32px; 
  color: white !important; 
  margin-bottom: 24px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.visi-quote-box {
  background: rgba(255,255,255,0.15); 
  border: 2px solid rgba(255,215,0,0.3);
  border-radius: 20px; 
  padding: 32px 36px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.visi-quote-box::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 80px;
  font-family: Georgia, serif;
  color: rgba(255,215,0,0.2);
  line-height: 1;
  font-weight: bold;
}
.visi-quote-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #FFD700, #FFA500, #FFD700, transparent);
  border-radius: 0 0 18px 18px;
}
.visi-quote-box * { 
  color: white !important; 
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}
.visi-quote-box p { 
  font-size: 18px !important; 
  line-height: 1.9 !important; 
  font-weight: 500 !important; 
  margin-bottom: 0 !important;
  text-align: center;
  position: relative;
  z-index: 1;
}
.visi-quote-box strong { 
  font-weight: 700 !important;
  color: #FFD700 !important;
  text-shadow: 0 2px 8px rgba(255,215,0,0.3);
}
.visi-quote-box em { 
  font-style: italic !important; 
}
.visi-quote-box u { 
  text-decoration: underline !important;
  text-decoration-color: rgba(255,215,0,0.5);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.visi-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.visi-tag {
  font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 9999px;
  background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.2);
}

.misi-list-wrapper { 
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
  position: relative;
  z-index: 1;
}
.misi-list-wrapper * {
  color: white !important;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}

/* Support for ordered list (ol) */
.misi-list-wrapper ol { 
  list-style: none !important; 
  padding: 0 !important; 
  margin: 0 !important; 
  counter-reset: misi-counter;
}
.misi-list-wrapper ol li {
  display: flex !important; 
  align-items: flex-start !important; 
  gap: 16px !important;
  padding: 16px 0 !important; 
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  counter-increment: misi-counter;
  position: relative !important;
}
.misi-list-wrapper ol li:last-child { 
  border-bottom: none !important; 
}
.misi-list-wrapper ol li::before {
  content: counter(misi-counter) !important;
  width: 32px !important; 
  height: 32px !important; 
  border-radius: 10px !important;
  background: linear-gradient(135deg, #FFD700, #FFA500) !important; 
  color: #111 !important;
  font-size: 14px !important; 
  font-weight: 800 !important;
  display: flex !important; 
  align-items: center !important; 
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 12px rgba(255,215,0,0.3) !important;
  margin-top: 2px !important;
}
.misi-list-wrapper ol li p { 
  font-size: 15px !important; 
  line-height: 1.7 !important; 
  margin: 0 !important;
  font-weight: 500 !important;
  flex: 1 !important;
}

/* Support for unordered list (ul) */
.misi-list-wrapper ul { 
  list-style: none !important; 
  padding: 0 !important; 
  margin: 0 !important; 
  counter-reset: misi-counter;
}
.misi-list-wrapper ul li {
  display: flex !important; 
  align-items: flex-start !important; 
  gap: 16px !important;
  padding: 16px 0 !important; 
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  counter-increment: misi-counter;
  position: relative !important;
}
.misi-list-wrapper ul li:last-child { 
  border-bottom: none !important; 
}
.misi-list-wrapper ul li::before {
  content: counter(misi-counter) !important;
  width: 32px !important; 
  height: 32px !important; 
  border-radius: 10px !important;
  background: linear-gradient(135deg, #FFD700, #FFA500) !important; 
  color: #111 !important;
  font-size: 14px !important; 
  font-weight: 800 !important;
  display: flex !important; 
  align-items: center !important; 
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 12px rgba(255,215,0,0.3) !important;
  margin-top: 2px !important;
}
.misi-list-wrapper ul li p { 
  font-size: 15px !important; 
  line-height: 1.7 !important; 
  margin: 0 !important;
  font-weight: 500 !important;
  flex: 1 !important;
}
.misi-list-wrapper ul li p span {
  color: white !important;
}

.misi-list { list-style: none; padding: 0; margin: 0; }
.misi-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.07);
}
.misi-item:last-child { border-bottom: none; }
.misi-bullet {
  width: 28px; height: 28px; border-radius: 8px;
  background: #FFD700; color: #111;
  font-size: 12px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.misi-text { color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.6; }

/* ─── SARPRAS ────────────────────────────────────────────────── */
.sarpras-section { background: white; padding: 80px 0; overflow: hidden; }

.sarpras-carousel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.sarpras-scroll-row {
  overflow: hidden;
  position: relative;
}

.sarpras-scroll-track {
  display: flex;
  gap: 20px;
  width: fit-content;
}

.scroll-ltr {
  animation: scrollLeft 50s linear infinite;
}

.scroll-rtl {
  animation: scrollRight 50s linear infinite;
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 3));
  }
}

@keyframes scrollRight {
  0% {
    transform: translateX(calc(-100% / 3));
  }
  100% {
    transform: translateX(0);
  }
}

.sarpras-scroll-row:hover .sarpras-scroll-track {
  animation-play-state: paused;
}

.sarpras-card-scroll {
  flex-shrink: 0;
  width: 300px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.sarpras-card-scroll:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.sarpras-img-scroll {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.sarpras-card-scroll:hover .sarpras-img-scroll {
  transform: scale(1.05);
}

.sarpras-overlay-scroll {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sarpras-card-scroll:hover .sarpras-overlay-scroll {
  opacity: 1;
}

.sarpras-nama-scroll {
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  line-height: 1.3;
}

.sarpras-zoom-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.sarpras-card-scroll:hover .sarpras-zoom-icon {
  opacity: 1;
  transform: scale(1);
}

.sarpras-zoom-icon i {
  font-size: 14px;
  color: #8B0000;
}

/* Modal Styles */
.sarpras-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.sarpras-modal-content {
  position: relative;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.sarpras-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.sarpras-modal-close:hover {
  background: white;
  transform: rotate(90deg);
}

.sarpras-modal-close i {
  font-size: 18px;
  color: #333;
}

.sarpras-modal-img {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

.sarpras-modal-title {
  padding: 20px 24px;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .sarpras-modal-content,
.modal-fade-leave-active .sarpras-modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .sarpras-modal-content {
  transform: scale(0.9);
}

.modal-fade-leave-to .sarpras-modal-content {
  transform: scale(0.9);
}

/* ─── STRUKTUR ───────────────────────────────────────────────── */
.struktur-section { background: #f4f4f5; }
.struktur-wrapper {
  background: white; border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.07);
  padding: 56px; overflow-x: auto;
}

.org-chart { display: flex; flex-direction: column; align-items: center; min-width: 680px; }
.org-row { display: flex; justify-content: center; gap: 20px; position: relative; }
.org-row-multi { gap: 32px; }

.org-connector-v { width: 2px; height: 36px; background: #d1d5db; margin: 0 auto; }
.org-h-line { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 200px; height: 2px; background: #d1d5db; z-index: 0; }
.org-h-line-full { width: 70%; height: 2px; background: #d1d5db; margin-bottom: 2px; }

.org-box {
  border-radius: 14px; padding: 16px 22px; text-align: center; position: relative; z-index: 1;
  transition: transform 0.25s ease, box-shadow 0.25s ease; min-width: 170px;
}
.org-box:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(0,0,0,0.18); }

.box-crimson { background: linear-gradient(135deg, #8B0000, #DC143C); color: white; }
.box-gold    { background: linear-gradient(135deg, #FFD700, #FFA500); color: #111; }
.box-dark    { background: linear-gradient(135deg, #1a1a1a, #333); color: white; }
.box-blue    { background: linear-gradient(135deg, #1565C0, #1E90FF); color: white; }
.box-green   { background: linear-gradient(135deg, #2E7D32, #388E3C); color: white; min-width: 140px; }
.box-purple  { background: linear-gradient(135deg, #6A1B9A, #9C27B0); color: white; min-width: 140px; }
.box-red     { background: linear-gradient(135deg, #C62828, #E53935); color: white; }

.org-jabatan { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.75; margin-bottom: 6px; }
.org-nama    { font-weight: 700; font-size: 14px; line-height: 1.4; }
.dark-text   { color: #111 !important; }

.guru-row { flex-wrap: wrap; gap: 12px; }

.org-legend {
  display: flex; gap: 32px; margin-top: 36px; padding-top: 24px;
  border-top: 1px solid #f0f0f0; justify-content: center;
}
.legend-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #666; }
.legend-line { width: 36px; height: 2px; background: #9ca3af; }
.legend-line.dashed { background: repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 5px, transparent 5px, transparent 10px); }

/* ─── FADE TRANSITION ─────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ─── REVEAL ANIMATION ───────────────────────────────────────── */
.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible { opacity: 1; transform: none; }
</style>

<style>
/* Global styles for v-html rendered content (visi misi) */
.misi-list-wrapper ul { 
  list-style: none !important; 
  padding: 0 !important; 
  margin: 0 !important; 
  counter-reset: misi-counter !important;
}

.misi-list-wrapper ul li {
  display: flex !important; 
  align-items: flex-start !important; 
  gap: 16px !important;
  padding: 16px 0 !important; 
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  counter-increment: misi-counter !important;
  position: relative !important;
}

.misi-list-wrapper ul li:last-child { 
  border-bottom: none !important; 
}

.misi-list-wrapper ul li::before {
  content: counter(misi-counter) !important;
  width: 32px !important; 
  height: 32px !important; 
  min-width: 32px !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #FFD700, #FFA500) !important; 
  color: #111 !important;
  font-size: 14px !important; 
  font-weight: 800 !important;
  display: flex !important; 
  align-items: center !important; 
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 12px rgba(255,215,0,0.3) !important;
  margin-top: 2px !important;
  font-family: 'Poppins', sans-serif !important;
}

.misi-list-wrapper ul li p { 
  font-size: 15px !important; 
  line-height: 1.7 !important; 
  margin: 0 !important;
  font-weight: 500 !important;
  flex: 1 !important;
  color: white !important;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}

.misi-list-wrapper ul li p span {
  color: white !important;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}

.misi-list-wrapper ol { 
  list-style: none !important; 
  padding: 0 !important; 
  margin: 0 !important; 
  counter-reset: misi-counter !important;
}

.misi-list-wrapper ol li {
  display: flex !important; 
  align-items: flex-start !important; 
  gap: 16px !important;
  padding: 16px 0 !important; 
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  counter-increment: misi-counter !important;
  position: relative !important;
}

.misi-list-wrapper ol li:last-child { 
  border-bottom: none !important; 
}

.misi-list-wrapper ol li::before {
  content: counter(misi-counter) !important;
  width: 32px !important; 
  height: 32px !important; 
  min-width: 32px !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #FFD700, #FFA500) !important; 
  color: #111 !important;
  font-size: 14px !important; 
  font-weight: 800 !important;
  display: flex !important; 
  align-items: center !important; 
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 4px 12px rgba(255,215,0,0.3) !important;
  margin-top: 2px !important;
  font-family: 'Poppins', sans-serif !important;
}

.misi-list-wrapper ol li p { 
  font-size: 15px !important; 
  line-height: 1.7 !important; 
  margin: 0 !important;
  font-weight: 500 !important;
  flex: 1 !important;
  color: white !important;
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}

.visi-quote-box * { 
  color: white !important; 
  font-family: 'Poppins', 'Plus Jakarta Sans', sans-serif !important;
}
</style>