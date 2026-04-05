<script setup>
const selectedVessel = ref(null)
</script>

<template>
  <div class="relative w-full h-screen">
    <MapView @vessel-click="v => selectedVessel = v" />
    <VesselPopup :vessel="selectedVessel" @close="selectedVessel = null" />
  </div>
</template>
