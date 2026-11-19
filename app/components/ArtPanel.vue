<script setup lang="ts">
/**
 * ArtPanel — soft, editorial artwork used wherever the reference layout
 * expects photography. Each variant is a self-contained SVG so the site stays
 * dependency-free. Pass `src` to drop in a real photograph instead.
 */
const props = withDefaults(
  defineProps<{
    variant?: string
    ratio?: string
    src?: string
  }>(),
  { variant: 'lab', ratio: '', src: '' },
)

const uid = Math.random().toString(36).slice(2, 8)
const id = (name: string) => `${name}-${uid}-${props.variant}`
</script>

<template>
  <div
    class="art"
    :class="[`art--${variant}`, { 'art--ratio': !!ratio }]"
    :style="ratio ? { aspectRatio: ratio } : undefined"
  >
    <img v-if="src" class="art__photo" :src="src" alt="" loading="lazy" decoding="async" />
    <svg v-else viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="presentation">
      <defs>
        <linearGradient :id="id('base')" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#f7fafd" />
          <stop offset="45%" stop-color="#eaf0f7" />
          <stop offset="100%" stop-color="#cfdff0" />
        </linearGradient>
        <linearGradient :id="id('deep')" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stop-color="#dbe9f5" />
          <stop offset="100%" stop-color="#a4c8e0" />
        </linearGradient>
        <linearGradient :id="id('glass')" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#e7f1f4" stop-opacity="0.65" />
          <stop offset="100%" stop-color="#d4e6f5" stop-opacity="0.5" />
        </linearGradient>
        <linearGradient :id="id('liquid')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9e2f6" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#a8cee6" stop-opacity="0.95" />
        </linearGradient>
        <linearGradient :id="id('skin')" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#ece3da" />
          <stop offset="55%" stop-color="#dfd4c9" />
          <stop offset="100%" stop-color="#c8bfb4" />
        </linearGradient>
        <linearGradient :id="id('cloth')" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#c8d6de" />
          <stop offset="55%" stop-color="#b0c3ce" />
          <stop offset="100%" stop-color="#95adba" />
        </linearGradient>
        <radialGradient :id="id('glow')" cx="0.62" cy="0.18" r="0.72">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="62%" stop-color="#ffffff" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
        <radialGradient :id="id('warm')" cx="0.22" cy="0.9" r="0.62">
          <stop offset="0%" stop-color="#efe6d6" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#efe6d6" stop-opacity="0" />
        </radialGradient>
        <radialGradient :id="id('vignette')" cx="0.5" cy="0.42" r="0.78">
          <stop offset="62%" stop-color="#0d47a1" stop-opacity="0" />
          <stop offset="100%" stop-color="#0d47a1" stop-opacity="0.16" />
        </radialGradient>
        <filter :id="id('blur')" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
        <filter :id="id('blur-md')" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter :id="id('blur-sm')" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter :id="id('soften')" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter :id="id('grain')">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="800" height="600" :fill="`url(#${id('base')})`" />

      <!-- ambient light & depth -->
      <g :filter="`url(#${id('blur')})`">
        <ellipse cx="580" cy="120" rx="320" ry="240" fill="#ffffff" opacity="0.95" />
        <ellipse cx="140" cy="520" rx="280" ry="210" :fill="`url(#${id('deep')})`" opacity="0.55" />
        <ellipse cx="760" cy="470" rx="200" ry="170" fill="#b1d3ea" opacity="0.45" />
      </g>

      <!-- soft bokeh -->
      <g :filter="`url(#${id('blur-md')})`">
        <circle cx="660" cy="96" r="58" fill="#ffffff" opacity="0.55" />
        <circle cx="742" cy="196" r="34" fill="#ffffff" opacity="0.4" />
        <circle cx="96" cy="150" r="42" fill="#ffffff" opacity="0.35" />
        <circle cx="520" cy="520" r="80" fill="#b1d3ea" opacity="0.3" />
      </g>

      <!-- ======================= lab ======================= -->
      <g v-if="variant === 'lab'">
        <ellipse cx="400" cy="452" rx="300" ry="42" fill="#9cc3dd" opacity="0.28" :filter="`url(#${id('blur-md')})`" />
        <path d="M40 456h720" stroke="#1976d2" stroke-width="1" opacity="0.28" />

        <!-- flask -->
        <g>
          <path d="M352 268v64l-52 118c-6 14 4 28 19 28h96c15 0 25-14 19-28l-52-118v-64z" :fill="`url(#${id('glass')})`" stroke="#4f94c9" stroke-width="1.1" stroke-opacity="0.5" />
          <path d="M322 396h94c10 0 16 9 13 18l-6 14c-4 9-11 14-20 14h-68c-9 0-16-5-20-14l-6-14c-3-9 3-18 13-18z" :fill="`url(#${id('liquid')})`" opacity="0.85" />
          <path d="M354 268h34" stroke="#4f94c9" stroke-width="2.4" stroke-opacity="0.55" stroke-linecap="round" />
          <path d="M362 300v52" stroke="#ffffff" stroke-width="6" stroke-opacity="0.65" stroke-linecap="round" />
        </g>

        <!-- beaker -->
        <g>
          <path d="M474 324h74v104c0 10-8 18-18 18h-38c-10 0-18-8-18-18z" :fill="`url(#${id('glass')})`" stroke="#4f94c9" stroke-width="1.1" stroke-opacity="0.5" />
          <path d="M476 376h70v54c0 9-7 16-16 16h-38c-9 0-16-7-16-16z" :fill="`url(#${id('liquid')})`" opacity="0.8" />
          <path d="M470 324h82" stroke="#4f94c9" stroke-width="2.2" stroke-opacity="0.55" stroke-linecap="round" />
          <path d="M486 340v96" stroke="#ffffff" stroke-width="5" stroke-opacity="0.6" stroke-linecap="round" />
        </g>

        <!-- test tubes -->
        <g>
          <rect x="262" y="352" width="22" height="104" rx="11" :fill="`url(#${id('glass')})`" stroke="#4f94c9" stroke-width="1" stroke-opacity="0.45" />
          <rect x="266" y="404" width="14" height="48" rx="7" :fill="`url(#${id('liquid')})`" opacity="0.85" />
          <rect x="292" y="372" width="22" height="84" rx="11" :fill="`url(#${id('glass')})`" stroke="#4f94c9" stroke-width="1" stroke-opacity="0.45" />
          <rect x="296" y="416" width="14" height="36" rx="7" :fill="`url(#${id('liquid')})`" opacity="0.7" />
        </g>

        <!-- droplets -->
        <g fill="#ffffff" opacity="0.65">
          <circle cx="560" cy="300" r="4" />
          <circle cx="586" cy="330" r="3" />
          <circle cx="546" cy="352" r="2.5" />
        </g>
      </g>

      <!-- ======================= cell ======================= -->
      <g v-else-if="variant === 'cell'">
        <g :filter="`url(#${id('blur-md')})`" opacity="0.55">
          <circle cx="210" cy="180" r="86" fill="#cfe3f5" />
          <circle cx="620" cy="420" r="96" fill="#b1d3ea" />
        </g>
        <!-- big cell -->
        <g>
          <circle cx="392" cy="292" r="146" :fill="`url(#${id('glass')})`" opacity="0.9" />
          <circle cx="392" cy="292" r="146" fill="none" stroke="#1976d2" stroke-width="1.6" stroke-opacity="0.55" />
          <circle cx="392" cy="292" r="112" fill="none" stroke="#1976d2" stroke-width="1" stroke-opacity="0.28" />
          <circle cx="380" cy="278" r="46" :fill="`url(#${id('liquid')})`" opacity="0.85" />
          <circle cx="380" cy="278" r="22" fill="#1976d2" opacity="0.32" />
        </g>
        <!-- second cell -->
        <g opacity="0.9">
          <circle cx="556" cy="212" r="74" fill="#ffffff" fill-opacity="0.55" stroke="#1976d2" stroke-width="1.4" stroke-opacity="0.45" />
          <circle cx="548" cy="202" r="20" fill="#1976d2" opacity="0.28" />
        </g>
        <!-- small budding cells -->
        <g fill="#ffffff" fill-opacity="0.5" stroke="#1976d2" stroke-width="1.2" stroke-opacity="0.35">
          <circle cx="266" cy="420" r="42" />
          <circle cx="500" cy="424" r="30" />
          <circle cx="620" cy="330" r="22" />
        </g>
        <g fill="#1976d2" opacity="0.2">
          <circle cx="266" cy="420" r="11" />
          <circle cx="500" cy="424" r="8" />
          <circle cx="620" cy="330" r="6" />
        </g>
      </g>

      <!-- ======================= helix ======================= -->
      <g v-else-if="variant === 'helix'">
        <ellipse cx="400" cy="300" rx="150" ry="260" fill="#ffffff" opacity="0.5" :filter="`url(#${id('blur')})`" />
        <g fill="none" stroke="#1976d2" opacity="0.6" stroke-linecap="round">
          <path d="M316 30c78 72 78 152 0 224s-78 152 0 224 78 92 78 122" stroke-width="2.2" />
          <path d="M484 30c-78 72-78 152 0 224s78 152 0 224-78 92-78 122" stroke-width="2.2" />
        </g>
        <g stroke="#1976d2" stroke-width="1.2" opacity="0.34">
          <path d="M326 76h148M340 122h120M356 168h88M372 214h56M382 260h36" />
          <path d="M382 340h36M372 386h56M356 432h88M340 478h120M326 524h148" />
        </g>
        <g fill="#1976d2" opacity="0.35">
          <circle cx="318" cy="76" r="4" />
          <circle cx="482" cy="122" r="4" />
          <circle cx="356" cy="168" r="4" />
          <circle cx="444" cy="432" r="4" />
          <circle cx="340" cy="478" r="4" />
          <circle cx="326" cy="524" r="4" />
        </g>
      </g>

      <!-- ======================= portrait ======================= -->
      <g v-else-if="variant === 'portrait'">
        <g :filter="`url(#${id('blur-md')})`" opacity="0.75">
          <rect x="470" y="30" width="320" height="380" rx="26" fill="#ffffff" opacity="0.8" />
          <rect x="40" y="320" width="260" height="260" rx="20" fill="#c9ddf0" opacity="0.55" />
          <ellipse cx="690" cy="470" rx="120" ry="150" fill="#aecde4" opacity="0.5" />
        </g>
        <g :filter="`url(#${id('soften')})`">
          <path
            d="M400 306c88 0 154 56 172 136 8 34 12 70 14 108H214c2-38 6-74 14-108 18-80 84-136 172-136z"
            :fill="`url(#${id('cloth')})`"
          />
          <path
            d="M400 306c-24 0-46 5-66 12 18 28 38 44 66 44s48-16 66-44c-20-7-42-12-66-12z"
            fill="#ded3c8"
            opacity="0.5"
          />
          <path d="M360 238h80v82c0 18-18 30-40 30s-40-12-40-30z" :fill="`url(#${id('skin')})`" />
          <path
            d="M400 96c52 0 90 40 90 96 0 28-4 54-12 76l10 22c6 13-4 26-17 26h-10c-15 22-36 33-61 33s-46-11-61-33h-10c-13 0-23-13-17-26l10-22c-8-22-12-48-12-76 0-56 38-96 90-96z"
            :fill="`url(#${id('skin')})`"
          />
          <path
            d="M400 90c58 0 96 42 96 100 0 10-1 20-3 30-11-46-44-74-93-74s-82 28-93 74c-2-10-3-20-3-30 0-58 38-100 96-100z"
            fill="#9caaae"
          />
          <path
            d="M400 118c34 0 60 22 68 54-16-20-38-32-68-32s-52 12-68 32c8-32 34-54 68-54z"
            fill="#aab7ba"
            opacity="0.7"
          />
        </g>
        <g fill="none" stroke="#ffffff" stroke-linecap="round" opacity="0.5">
          <path d="M330 216c-6 24-5 50 3 74" stroke-width="7" />
          <path d="M262 438c-14 28-22 64-24 112" stroke-width="9" />
          <path d="M538 442c12 26 20 60 22 108" stroke-width="7" opacity="0.6" />
        </g>
        <ellipse cx="400" cy="566" rx="290" ry="70" fill="#9cc3dd" opacity="0.22" :filter="`url(#${id('blur-md')})`" />
      </g>

      <!-- ======================= facility ======================= -->
      <g v-else-if="variant === 'facility'">
        <path d="M0 150 L400 250 L800 150 L800 0 L0 0 Z" fill="#ffffff" opacity="0.35" />
        <g stroke="#1976d2" opacity="0.3" fill="none">
          <path d="M0 150L400 250L800 150" stroke-width="1.4" />
          <path d="M110 60v420M250 30v470M550 30v470M690 60v420" stroke-width="1" opacity="0.7" />
          <path d="M0 470h800" stroke-width="1.2" />
        </g>
        <g fill="#ffffff" opacity="0.85" :filter="`url(#${id('blur-sm')})`">
          <ellipse cx="250" cy="120" rx="70" ry="14" />
          <ellipse cx="550" cy="120" rx="70" ry="14" />
        </g>
        <g>
          <rect x="120" y="286" width="150" height="70" rx="8" :fill="`url(#${id('glass')})`" stroke="#1976d2" stroke-width="1.1" stroke-opacity="0.35" />
          <rect x="540" y="286" width="170" height="70" rx="8" :fill="`url(#${id('glass')})`" stroke="#1976d2" stroke-width="1.1" stroke-opacity="0.35" />
          <rect x="120" y="372" width="150" height="98" rx="6" fill="#d4e6f5" opacity="0.4" />
          <rect x="540" y="372" width="170" height="98" rx="6" fill="#d4e6f5" opacity="0.35" />
          <path d="M0 520h800" stroke="#1976d2" stroke-width="1" opacity="0.2" />
        </g>
      </g>

      <!-- ======================= molecule ======================= -->
      <g v-else-if="variant === 'molecule'">
        <rect width="800" height="600" fill="#e6eff8" opacity="0.55" />
        <ellipse cx="520" cy="240" rx="230" ry="200" fill="#ffffff" opacity="0.55" :filter="`url(#${id('blur')})`" />
        <g stroke="#1976d2" fill="none" opacity="0.4" stroke-width="1.4">
          <path d="M250 200l140 60M390 260l150-48M390 260l-44 148M346 408l150 36M496 444l64-136M560 308l-170-48M250 200l56 128M306 328l40 80" />
        </g>
        <g>
          <circle cx="250" cy="200" r="16" fill="#ffffff" stroke="#1976d2" stroke-width="1.6" stroke-opacity="0.6" />
          <circle cx="390" cy="260" r="22" :fill="`url(#${id('liquid')})`" opacity="0.9" />
          <circle cx="540" cy="212" r="12" fill="#ffffff" stroke="#1976d2" stroke-width="1.6" stroke-opacity="0.55" />
          <circle cx="560" cy="308" r="16" fill="#ffffff" stroke="#1976d2" stroke-width="1.6" stroke-opacity="0.55" />
          <circle cx="496" cy="444" r="14" :fill="`url(#${id('liquid')})`" opacity="0.8" />
          <circle cx="346" cy="408" r="18" fill="#ffffff" stroke="#1976d2" stroke-width="1.6" stroke-opacity="0.6" />
          <circle cx="306" cy="328" r="10" fill="#1976d2" opacity="0.4" />
        </g>
        <g fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85">
          <circle cx="676" cy="118" r="48" />
          <circle cx="676" cy="118" r="28" />
        </g>
      </g>

      <!-- ======================= plate ======================= -->
      <g v-else-if="variant === 'plate'">
        <g :filter="`url(#${id('blur-md')})`">
          <ellipse cx="400" cy="330" rx="360" ry="150" fill="#9cc3dd" opacity="0.2" />
        </g>
        <g>
          <template v-for="row in [188, 300, 412]" :key="row">
            <circle
              v-for="x in [96, 198, 300, 402, 504, 606, 708]"
              :key="`${row}-${x}`"
              :cx="x"
              :cy="row"
              r="30"
              fill="#a9d3de"
              :opacity="row === 300 ? 0.72 : 0.5"
            />
            <circle
              v-for="x in [96, 198, 300, 402, 504, 606, 708]"
              :key="`o-${row}-${x}`"
              :cx="x"
              :cy="row"
              r="30"
              fill="none"
              stroke="#ffffff"
              stroke-width="2.5"
              :opacity="row === 300 ? 0.9 : 0.6"
            />
          </template>
        </g>
        <g fill="#1976d2" opacity="0.35">
          <circle cx="300" cy="300" r="11" />
          <circle cx="504" cy="188" r="8" />
          <circle cx="606" cy="412" r="7" />
        </g>
        <g fill="none" stroke="#1976d2" stroke-width="1.4" opacity="0.3">
          <path d="M40 120h720M40 480h720" />
        </g>
      </g>

      <!-- ======================= team ======================= -->
      <g v-else-if="variant === 'team'">
        <g :filter="`url(#${id('blur-md')})`">
          <rect x="80" y="120" width="640" height="240" rx="16" fill="#ffffff" opacity="0.7" />
          <ellipse cx="400" cy="470" rx="310" ry="110" fill="#b1d3ea" opacity="0.45" />
        </g>
        <g fill="#b9c9ce">
          <path d="M150 600c4-70 44-118 100-118s94 48 98 118z" opacity="0.95" />
          <path d="M486 600c4-64 40-108 90-108s86 44 90 108z" opacity="0.9" />
        </g>
        <g fill="#cdd8db">
          <circle cx="248" cy="452" r="50" />
          <circle cx="576" cy="470" r="46" />
        </g>
        <g fill="none" stroke="#1976d2" stroke-width="1.1" opacity="0.3">
          <path d="M120 396h560" />
          <path d="M180 396v-34h170v34M430 396v-30h150v30" />
        </g>
        <g fill="#ffffff" opacity="0.5">
          <rect x="300" y="250" width="200" height="120" rx="6" />
        </g>
      </g>

      <!-- ======================= map ======================= -->
      <g v-else-if="variant === 'map'">
        <rect width="800" height="600" fill="#eff3f8" />
        <g fill="#e2e9e5">
          <rect x="40" y="40" width="200" height="150" rx="14" />
          <rect x="280" y="40" width="240" height="150" rx="14" />
          <rect x="560" y="40" width="200" height="150" rx="14" />
          <rect x="40" y="230" width="200" height="330" rx="14" />
          <rect x="280" y="230" width="240" height="150" rx="14" />
          <rect x="560" y="230" width="200" height="150" rx="14" />
          <rect x="280" y="420" width="240" height="140" rx="14" />
          <rect x="560" y="420" width="200" height="140" rx="14" />
        </g>
        <g stroke="#c9d8d1" stroke-width="14" opacity="0.9">
          <path d="M0 205h800M0 400h800M258 0v600M540 0v600" />
        </g>
        <g stroke="#ffffff" stroke-width="2" opacity="0.9" stroke-dasharray="10 12">
          <path d="M0 205h800M0 400h800M258 0v600M540 0v600" />
        </g>
        <g :filter="`url(#${id('blur-sm')})`">
          <circle cx="430" cy="300" r="52" fill="#90caf9" opacity="0.55" />
        </g>
        <g transform="translate(430 300)">
          <path d="M0-44c22 0 40 17 40 39 0 27-40 61-40 61s-40-34-40-61c0-22 18-39 40-39z" fill="#1976d2" />
          <circle cx="0" cy="-6" r="14" fill="#ffffff" />
        </g>
      </g>

      <rect width="800" height="600" :fill="`url(#${id('warm')})`" opacity="0.4" />
      <rect width="800" height="600" :fill="`url(#${id('glow')})`" opacity="0.5" />
      <rect width="800" height="600" :fill="`url(#${id('vignette')})`" />
      <rect width="800" height="600" :filter="`url(#${id('grain')})`" opacity="0.55" />
    </svg>
  </div>
</template>

<style scoped>
.art {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #eaf0f7;
}

.art--ratio {
  position: relative;
  inset: auto;
  width: 100%;
}

.art svg,
.art__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
