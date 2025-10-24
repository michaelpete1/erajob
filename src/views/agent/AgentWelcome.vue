<template>
  <div class="relative min-h-screen bg-gradient-to-br from-brand-teal via-teal-600 to-teal-700 flex items-center justify-center overflow-hidden">
    <div class="absolute top-0 right-0 h-32 w-32 md:h-48 md:w-48 rounded-full bg-white/10 translate-x-1/4 -translate-y-1/4 backdrop-blur-sm animate-pulse-slow" />
    <div class="absolute bottom-0 left-0 h-24 w-24 md:h-40 md:w-40 rounded-full bg-white/10 -translate-x-1/4 translate-y-1/4 backdrop-blur-sm animate-pulse-slow-reverse" />
    <div class="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm animate-float" />
    
    <div class="absolute top-16 left-16 w-2 h-2 sm:top-20 sm:left-20 bg-white/20 rounded-full animate-float-delayed-1" />
    <div class="absolute top-32 right-24 w-1 h-1 sm:top-40 sm:right-32 bg-white/30 rounded-full animate-float-delayed-2" />
    <div class="absolute bottom-24 left-32 w-1.5 h-1.5 sm:bottom-32 sm:left-40 bg-white/25 rounded-full animate-float-delayed-3" />
    <div class="absolute bottom-16 right-16 w-2.5 h-2.5 sm:bottom-20 sm:right-20 bg-white/15 rounded-full animate-float-delayed-4" />

    <div class="relative z-10 w-full max-w-md sm:max-w-lg px-4 py-6">
      <form class="space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl animate-fade-up-delay-2">
        <div class="animate-slide-in-left">
          <input v-model="form.primaryExpertise" type="text" placeholder="What is your Primary area of expertise" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in expertiseOptions" :key="opt" type="button" @click="form.primaryExpertise = opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>
        <div class="animate-slide-in-right">
          <input 
            v-model="form.personalityUrl"
            type="url"
            placeholder="Or paste personality screenshot URL"
            class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>
        <div class="animate-slide-in-right">
          <input v-model.number="form.yearsOfExperience" type="number" min="0" placeholder="Years of Experience" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in yearsOptions" :key="opt" type="button" @click="form.yearsOfExperience = opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>
        <div class="animate-slide-in-left">
          <input v-model="form.tools" type="text" placeholder="3 most used tools or platforms" class="w-full rounded-full border border-gray-200 px-4 sm:px-5 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          <div class="mt-2 flex flex-wrap gap-2">
            <button v-for="opt in toolsOptions" :key="opt" type="button" @click="form.tools = form.tools ? `${form.tools}, ${opt}` : opt" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-brand-teal hover:text-brand-teal transition">{{ opt }}</button>
          </div>
        </div>

        <div class="animate-slide-in-right">
          <input 
            v-model="form.phoneNumber"
            type="tel"
            placeholder="Phone Number"
            class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="space-y-2 animate-slide-in-left">
          <label class="text-sm font-medium text-brand-teal">Certifications</label>
          <div class="relative">
            <input 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleCertificationsUpload"
              class="hidden" 
              ref="certificationsInput"
              id="certifications-upload"
            />
            <label 
              for="certifications-upload" 
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-brand-teal hover:bg-brand-teal/5 animate-pulse"
            >
              <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm text-gray-600">Click to upload certifications</span>
              <span class="text-xs text-gray-500">PDF, DOC, JPG, PNG (max 10MB each)</span>
              <div v-if="certificationsFiles.length > 0" class="mt-2 text-xs text-brand-teal font-medium">
                {{ certificationsFiles.length }} file(s) selected
              </div>
            </label>
          </div>
          <div class="mt-2">
            <input 
              v-model="form.certificateUrls"
              type="text"
              placeholder="Or paste certificate URLs (comma-separated)"
              class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
          </div>
        </div>

        <div class="animate-slide-in-left">
          <button type="button" class="modal-trigger" @click="openHoursModal">
            <div class="modal-trigger__label">
              <span class="modal-trigger__tag">Weekly Availability</span>
              <span class="modal-trigger__value">{{ hoursLabel }}</span>
            </div>
            <span class="modal-trigger__icon" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
        <div class="animate-slide-in-right">
          <button type="button" class="modal-trigger" @click="openTimezoneModal">
            <div class="modal-trigger__label">
              <span class="modal-trigger__tag">Time Zone · Location</span>
              <span class="modal-trigger__value">{{ timezoneLabel }}</span>
            </div>
            <span class="modal-trigger__icon" aria-hidden="true">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showTimezoneModal" class="timezone-modal" @click.self="closeTimezoneModal">
              <div class="timezone-modal__panel">
                <header class="timezone-modal__header">
                  <div>
                    <h3 class="timezone-modal__title">Select your time zone</h3>
                    <p class="timezone-modal__subtitle">Choose the city or offset that best matches your working hours.</p>
                  </div>
                  <button type="button" class="timezone-modal__close" @click="closeTimezoneModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="timezone-modal__search">
                  <svg class="w-5 h-5 text-brand-teal/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010.65 7a7 7 0 006 9.65z" />
                  </svg>
                  <input
                    v-model="timezoneQuery"
                    type="text"
                    class="timezone-modal__input"
                    placeholder="Search city, country, or UTC offset"
                  />
                </div>
                <div class="timezone-modal__list">
                  <button
                    v-for="option in filteredTimezones"
                    :key="option.value"
                    type="button"
                    class="timezone-option"
                    :class="{ 'timezone-option--active': form.timezone === option.value }"
                    @click="selectTimezone(option)"
                  >
                    <div class="timezone-option__label">
                      <span class="timezone-option__primary">{{ option.label }}</span>
                      <span class="timezone-option__secondary">{{ option.meta }}</span>
                    </div>
                    <div class="timezone-option__offset">{{ option.value }}</div>
                  </button>
                  <div v-if="!filteredTimezones.length" class="timezone-modal__empty">
                    No matches found. Try a different city or offset.
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <div class="animate-slide-in-left">
          <div class="relative" ref="projectsRef" style="z-index: 100;">
            <div
              @click="toggleProjectsDropdown"
              role="button"
              tabindex="0"
              class="form-input cursor-pointer flex items-center justify-between bg-white min-h-[44px]"
            >
              <span class="text-gray-500">
                {{ form.preferredProjects.length === 0 ? 'Select your preferred projects' : `${form.preferredProjects.length} project${form.preferredProjects.length > 1 ? 's' : ''} selected` }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': showProjectsDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Modal Popup Box will be teleported to body -->
            <teleport to="body">
              <div
                v-if="showProjectsDropdown"
                class="fixed inset-0 z-[9999] bg-black/30 flex items-start pt-16 justify-center sm:items-start sm:justify-center sm:bg-transparent"
                @click="showProjectsDropdown = false"
              >
                <div
                  class="w-[85%] max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden mt-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:top-20"
                  @click.stop
                >
                  <!-- Modal Header -->
                  <div class="bg-brand-teal text-white p-3 sm:p-4">
                    <h3 class="text-base font-semibold">Select Project Types</h3>
                    <p class="text-teal-100 text-xs">
                      Choose project types you're interested in working on
                    </p>
                  </div>
                  
                  <!-- Modal Body -->
                  <div class="p-3 max-h-[50vh] overflow-y-auto">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div
                        v-for="project in projectOptions"
                        :key="project"
                        @click="toggleProject(project)"
                        class="px-2.5 py-1.5 cursor-pointer hover:bg-brand-teal/5 rounded-md transition-colors flex items-center justify-between text-xs"
                      >
                        <span class="text-gray-700">{{ project }}</span>
                        <svg
                          v-if="form.preferredProjects.includes(project)"
                          class="w-4 h-4 text-brand-teal flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </teleport>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="animate-slide-in-right">
            <button type="button" class="modal-trigger" @click="openCallsModal">
              <div class="modal-trigger__label">
                <span class="modal-trigger__tag">Communication</span>
                <span class="modal-trigger__value">{{ callsLabel }}</span>
              </div>
              <span class="modal-trigger__icon" aria-hidden="true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
          <div class="animate-slide-in-left">
            <button type="button" class="modal-trigger" @click="openComputerModal">
              <div class="modal-trigger__label">
                <span class="modal-trigger__tag">Device Access</span>
                <span class="modal-trigger__value">{{ computerLabel }}</span>
              </div>
              <span class="modal-trigger__icon" aria-hidden="true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
          <div class="animate-slide-in-right">
            <button type="button" class="modal-trigger" @click="openInternetModal">
              <div class="modal-trigger__label">
                <span class="modal-trigger__tag">Internet Reliability</span>
                <span class="modal-trigger__value">{{ internetLabel }}</span>
              </div>
              <span class="modal-trigger__icon" aria-hidden="true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
          <div class="animate-slide-in-left">
            <button type="button" class="modal-trigger" @click="openTrackingModal">
              <div class="modal-trigger__label">
                <span class="modal-trigger__tag">Tracking Tools</span>
                <span class="modal-trigger__value">{{ trackingLabel }}</span>
              </div>
              <span class="modal-trigger__icon" aria-hidden="true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showHoursModal" class="modal-shell" @click.self="closeHoursModal">
              <div class="modal-card">
                <header class="modal-card__header">
                  <div>
                    <h3>Pick your weekly commitment</h3>
                    <p>Select the hours you can consistently dedicate to client projects.</p>
                  </div>
                  <button type="button" class="modal-card__close" @click="closeHoursModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="modal-card__body grid sm:grid-cols-2 gap-2">
                  <button
                    v-for="option in hoursOptions"
                    :key="option"
                    type="button"
                    class="choice-tile"
                    :class="{ 'choice-tile--active': form.hoursPerWeek === option }"
                    @click="selectHours(option)"
                  >
                    <span class="choice-tile__title">{{ option }} hrs / week</span>
                    <span class="choice-tile__subtitle">Ideal for {{ Math.round(option / 20) }} client projects.</span>
                  </button>
                  <button type="button" class="choice-tile choice-tile--ghost sm:col-span-2" @click="clearHours">
                    Clear availability
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showCallsModal" class="modal-shell" @click.self="closeCallsModal">
              <div class="modal-card">
                <header class="modal-card__header">
                  <div>
                    <h3>Communication preference</h3>
                    <p>Let clients know how you prefer to connect for updates.</p>
                  </div>
                  <button type="button" class="modal-card__close" @click="closeCallsModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="modal-card__body">
                  <button
                    v-for="option in communicationOptions"
                    :key="`calls-${option.value}`"
                    type="button"
                    class="choice-tile"
                    :class="{ 'choice-tile--active': form.openToCalls === option.value }"
                    @click="selectCalls(option.value)"
                  >
                    <span class="choice-tile__title">{{ option.title }}</span>
                    <span class="choice-tile__subtitle">{{ option.description }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showComputerModal" class="modal-shell" @click.self="closeComputerModal">
              <div class="modal-card">
                <header class="modal-card__header">
                  <div>
                    <h3>Computer availability</h3>
                    <p>Confirm whether you have access to a dependable work device.</p>
                  </div>
                  <button type="button" class="modal-card__close" @click="closeComputerModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="modal-card__body">
                  <button
                    v-for="option in computerOptions"
                    :key="`computer-${option.value}`"
                    type="button"
                    class="choice-tile"
                    :class="{ 'choice-tile--active': form.hasComputer === option.value }"
                    @click="selectComputer(option.value)"
                  >
                    <span class="choice-tile__title">{{ option.title }}</span>
                    <span class="choice-tile__subtitle">{{ option.description }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showInternetModal" class="modal-shell" @click.self="closeInternetModal">
              <div class="modal-card">
                <header class="modal-card__header">
                  <div>
                    <h3>Internet reliability</h3>
                    <p>Share the stability level of your connection for remote work.</p>
                  </div>
                  <button type="button" class="modal-card__close" @click="closeInternetModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="modal-card__body">
                  <button
                    v-for="option in internetOptions"
                    :key="`internet-${option.value}`"
                    type="button"
                    class="choice-tile"
                    :class="{ 'choice-tile--active': form.hasInternet === option.value }"
                    @click="selectInternet(option.value)"
                  >
                    <span class="choice-tile__title">{{ option.title }}</span>
                    <span class="choice-tile__subtitle">{{ option.description }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <teleport to="body">
          <transition name="fade">
            <div v-if="showTrackingModal" class="modal-shell" @click.self="closeTrackingModal">
              <div class="modal-card">
                <header class="modal-card__header">
                  <div>
                    <h3>Time-tracking preference</h3>
                    <p>Let clients know if you’re comfortable using activity trackers.</p>
                  </div>
                  <button type="button" class="modal-card__close" @click="closeTrackingModal" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </header>
                <div class="modal-card__body">
                  <button
                    v-for="option in trackingOptions"
                    :key="`tracking-${option.value}`"
                    type="button"
                    class="choice-tile"
                    :class="{ 'choice-tile--active': form.comfortableWithTracking === option.value }"
                    @click="selectTracking(option.value)"
                  >
                    <span class="choice-tile__title">{{ option.title }}</span>
                    <span class="choice-tile__subtitle">{{ option.description }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </teleport>
        <div class="animate-slide-in-right">
          <input v-model="form.videoUrl" type="url" placeholder="Submit your 1min video (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="animate-slide-in-left">
          <input v-model="form.portfolioLink" type="url" placeholder="Portfolio link (URL)" class="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition-all" />
        </div>

        <div class="space-y-2 animate-slide-in-left">
          <label class="text-sm font-medium text-brand-teal">Personality Test Screenshot</label>
          <div class="relative">
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp"
              @change="handlePersonalityTestUpload"
              class="hidden" 
              ref="personalityTestInput"
              id="personality-test-upload"
            />
            <label 
              for="personality-test-upload" 
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-brand-teal hover:bg-brand-teal/5 animate-pulse"
            >
              <svg class="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-600">Click to upload screenshot</span>
              <span class="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
              <div v-if="personalityTestFile" class="mt-2 text-xs text-brand-teal font-medium">
                {{ personalityTestFile.name }}
              </div>
            </label>
          </div>
        </div>

      </form>
      <div class="space-y-3 pt-4 animate-fade-up-delay-4">
        <button
          @click="onSubmit"
          :disabled="isSubmitting"
          class="btn-pressable block w-full rounded-full bg-brand-teal px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Next' }}
        </button>
        <button class="btn-pressable block w-full rounded-full border border-brand-teal/30 bg-brand-teal/10 px-6 py-3 text-sm text-brand-teal hover:bg-brand-teal/20 transition-all duration-300" @click="$router.back()">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTimezones } from '../../composables/useTimezones'

const router = useRouter()
const isSubmitting = ref(false)
const showProjectsDropdown = ref(false)
const projectsRef = ref<HTMLElement | null>(null)
const showTimezoneModal = ref(false)
const showHoursModal = ref(false)
const showCallsModal = ref(false)
const showComputerModal = ref(false)
const showInternetModal = ref(false)
const showTrackingModal = ref(false)
const timezoneQuery = ref('')

const form = reactive({
  primaryExpertise: '',
  yearsOfExperience: 0 as number,
  tools: '',
  phoneNumber: '',
  hoursPerWeek: undefined as number | undefined,
  timezone: '',
  preferredProjects: [] as string[],
  openToCalls: undefined as boolean | undefined,
  hasComputer: undefined as boolean | undefined,
  hasInternet: undefined as boolean | undefined,
  comfortableWithTracking: undefined as boolean | undefined,
  videoUrl: '',
  portfolioLink: '',
  certificateUrls: '',
  personalityUrl: ''
})

const certificationsFiles = ref<File[]>([])
const personalityTestFile = ref<File | null>(null)
const certificationsInput = ref<HTMLInputElement | null>(null)
const personalityTestInput = ref<HTMLInputElement | null>(null)

const projectOptions = [
  'Sales',
  'Customer Service',
  'Editing',
  'Book Keeping',
  'Executive Assitant',
  'Appointment Setting'
]

const expertiseOptions = [
  'Sales',
  'Customer Service',
  'Editing',
  'Book Keeping',
  'Executive Assitant',
  'Appointment Setting'
]

const yearsOptions = [0,1,2,3,5,7,10,15]

const toolsOptions = [
  'GHL: Dispute Fox',
  'Ring Central',
  'Vonage',
  'Go To Connect',
  'Excel',
  'Google Chrome',
  'Google Drive'
]

const timezoneOptions = useTimezones()

const hoursOptions = [80, 120]

type BooleanChoice = { value: boolean; title: string; description: string }

const communicationOptions: BooleanChoice[] = [
  { value: true, title: 'Yes', description: 'I am available for voice or video calls.' },
  { value: false, title: 'No', description: 'I prefer asynchronous updates only.' }
]

const computerOptions: BooleanChoice[] = [
  { value: true, title: 'Yes', description: 'I have a reliable computer or laptop.' },
  { value: false, title: 'No', description: 'I do not have reliable computer access.' }
]

const internetOptions: BooleanChoice[] = [
  { value: true, title: 'Yes', description: 'My internet connection is stable.' },
  { value: false, title: 'No', description: 'My internet connection is not stable.' }
]

const trackingOptions: BooleanChoice[] = [
  { value: true, title: 'Yes', description: 'I am okay using time-tracking tools.' },
  { value: false, title: 'No', description: 'I am not okay using time-tracking tools.' }
]

const timezoneLabel = computed(() => {
  if (!form.timezone) return 'Tap to choose your time zone'
  const match = timezoneOptions.find(option => option.value === form.timezone)
  return match ? `${match.label}` : form.timezone
})

const hoursLabel = computed(() => {
  if (typeof form.hoursPerWeek === 'number') return `${form.hoursPerWeek} hours per week`
  return 'Tap to set weekly commitment'
})

const callsLabel = computed<string>(() => {
  if (form.openToCalls === true) return 'Open to video / voice meetings'
  if (form.openToCalls === false) return 'Prefer async updates only'
  return 'Tap to choose communication preference'
})

const computerLabel = computed<string>(() => {
  if (form.hasComputer === true) return 'Have daily access to a work-ready computer'
  if (form.hasComputer === false) return 'No reliable computer available'
  return 'Tap to confirm computer availability'
})

const internetLabel = computed<string>(() => {
  if (form.hasInternet === true) return 'Stable high-speed internet connection'
  if (form.hasInternet === false) return 'Internet may be unstable or limited'
  return 'Tap to describe internet reliability'
})

const trackingLabel = computed<string>(() => {
  if (form.comfortableWithTracking === true) return 'Comfortable using time-tracking tools'
  if (form.comfortableWithTracking === false) return 'Prefer working without tracking tools'
  return 'Tap to share tracking preference'
})

const filteredTimezones = computed(() => {
  const query = timezoneQuery.value.trim().toLowerCase()
  if (!query) {
    return timezoneOptions.map(option => ({
      value: option.value,
      label: option.label.split('•')[0]?.trim() ?? option.label,
      meta: option.label.split('•')[1]?.trim() ?? ''
    }))
  }
  return timezoneOptions
    .filter(option => option.searchText.includes(query))
    .map(option => ({
      value: option.value,
      label: option.label.split('•')[0]?.trim() ?? option.label,
      meta: option.label.split('•')[1]?.trim() ?? ''
    }))
})

const openTimezoneModal = () => {
  timezoneQuery.value = ''
  showTimezoneModal.value = true
}

const closeTimezoneModal = () => {
  showTimezoneModal.value = false
}

const selectTimezone = (option: { value: string }) => {
  form.timezone = option.value
  closeTimezoneModal()
}

const openHoursModal = () => {
  showHoursModal.value = true
}

const closeHoursModal = () => {
  showHoursModal.value = false
}

const selectHours = (hours: number) => {
  form.hoursPerWeek = hours
  closeHoursModal()
}

const clearHours = () => {
  form.hoursPerWeek = undefined
  closeHoursModal()
}

const openCallsModal = () => {
  showCallsModal.value = true
}

const closeCallsModal = () => {
  showCallsModal.value = false
}

const selectCalls = (value: boolean) => {
  form.openToCalls = value
  closeCallsModal()
}

const openComputerModal = () => {
  showComputerModal.value = true
}

const closeComputerModal = () => {
  showComputerModal.value = false
}

const selectComputer = (value: boolean) => {
  form.hasComputer = value
  closeComputerModal()
}

const openInternetModal = () => {
  showInternetModal.value = true
}

const closeInternetModal = () => {
  showInternetModal.value = false
}

const selectInternet = (value: boolean) => {
  form.hasInternet = value
  closeInternetModal()
}

const openTrackingModal = () => {
  showTrackingModal.value = true
}

const closeTrackingModal = () => {
  showTrackingModal.value = false
}

const selectTracking = (value: boolean) => {
  form.comfortableWithTracking = value
  closeTrackingModal()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  closeTimezoneModal()
  closeHoursModal()
  closeCallsModal()
  closeComputerModal()
  closeInternetModal()
  closeTrackingModal()
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

const handleCertificationsUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    certificationsFiles.value = Array.from(target.files)
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = certificationsFiles.value.filter(file => file.size > maxSize)
    
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is 10MB per file.`)
      certificationsFiles.value = certificationsFiles.value.filter(file => file.size <= maxSize)
    }
    // Persist filenames
    try {
      const existing = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
      existing.certifications = certificationsFiles.value.map(f => f.name)
      localStorage.setItem('agentWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}

const handlePersonalityTestUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 5MB.')
      if (personalityTestInput.value) {
        personalityTestInput.value.value = ''
      }
      return
    }
    
    personalityTestFile.value = file
    // Persist filename
    try {
      const existing = JSON.parse(localStorage.getItem('agentWelcomeData') || '{}')
      existing.personalityTest = personalityTestFile.value?.name
      localStorage.setItem('agentWelcomeData', JSON.stringify(existing))
    } catch {}
  }
}

// Project selection methods
const updateDropdownPosition = async () => {
  await nextTick()
  if (projectsRef.value) {
    const rect = projectsRef.value.getBoundingClientRect()
    document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY}px`)
  }
}

const toggleProjectsDropdown = async () => {
  if (!showProjectsDropdown.value) {
    await updateDropdownPosition()
  }
  showProjectsDropdown.value = !showProjectsDropdown.value
  console.log('toggleProjectsDropdown new value:', showProjectsDropdown.value)
}

const toggleProject = (project: string) => {
  const index = form.preferredProjects.indexOf(project)
  if (index > -1) {
    form.preferredProjects.splice(index, 1)
  } else {
    form.preferredProjects.push(project)
  }
}

const onSubmit = async () => {
  isSubmitting.value = true

  try {
    const basicData = JSON.parse(localStorage.getItem('signupBasicData') || '{}')
    if (!basicData.email) {
      alert('Signup information not found. Please start the signup process again.')
      router.push('/sign-up')
      return
    }

    const welcomeData = {
      primaryExpertise: form.primaryExpertise,
      yearsOfExperience: form.yearsOfExperience,
      tools: form.tools,
      phoneNumber: form.phoneNumber,
      hoursPerWeek: form.hoursPerWeek,
      timezone: form.timezone,
      preferredProjects: form.preferredProjects,
      openToCalls: form.openToCalls,
      hasComputer: form.hasComputer,
      hasInternet: form.hasInternet,
      comfortableWithTracking: form.comfortableWithTracking,
      videoUrl: form.videoUrl,
      certifications: certificationsFiles.value.map(f => f.name),
      personalityTest: personalityTestFile.value?.name,
      portfolioLink: form.portfolioLink,
      certificateUrls: form.certificateUrls,
      personalityUrl: form.personalityUrl
    }
    localStorage.setItem('agentWelcomeData', JSON.stringify(welcomeData))
    router.push('/agent/congrats')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error saving your information. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
.timezone-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
}

.timezone-modal__panel,
.modal-card {
  width: 100%;
  max-width: 36rem;
  border-radius: 1.75rem;
  background: #ffffff;
  border: 1px solid rgba(13, 148, 136, 0.35);
  box-shadow: 0 30px 70px rgba(15, 118, 110, 0.24);
  overflow: hidden;
}

.timezone-modal__header,
.modal-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(13, 148, 136, 1), rgba(20, 184, 166, 1));
  color: #ffffff;
}

.timezone-modal__title,
.modal-card__header h3 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.timezone-modal__subtitle,
.modal-card__header p {
  margin-top: 0.4rem;
  font-size: 0.72rem;
  color: rgba(236, 253, 245, 0.85);
}

.timezone-modal__close,
.modal-card__close {
  display: inline-flex;
  padding: 0.35rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.timezone-modal__close:hover,
.timezone-modal__close:focus-visible,
.modal-card__close:hover,
.modal-card__close:focus-visible {
  background: rgba(255, 255, 255, 0.25);
  outline: none;
}

.timezone-modal__search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(13, 148, 136, 0.3);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 18px rgba(13, 148, 136, 0.08);
}

.timezone-modal__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: #1f2937;
}

.timezone-modal__input:focus {
  outline: none;
}

.timezone-modal__list,
.modal-card__body {
  max-height: 55vh;
  overflow-y: auto;
  padding: 0.5rem 0.75rem 1.25rem;
  display: grid;
  gap: 0.75rem;
}

.timezone-option,
.choice-tile {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(13, 148, 136, 0.15);
  background: #ffffff;
  text-align: left;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(13, 148, 136, 0.08);
}

.timezone-option:hover,
.choice-tile:hover {
  border-color: rgba(13, 148, 136, 0.4);
  background: rgba(13, 148, 136, 0.08);
  box-shadow: 0 12px 20px rgba(13, 148, 136, 0.12);
}

.timezone-option--active,
.choice-tile--active {
  border-color: rgba(13, 148, 136, 0.9);
  background: rgba(13, 148, 136, 0.12);
  box-shadow: 0 14px 26px rgba(13, 148, 136, 0.18);
}

.choice-tile--ghost {
  border-style: dashed;
  border-color: rgba(15, 23, 42, 0.15);
  background: rgba(241, 245, 249, 0.6);
  text-align: center;
  font-weight: 600;
}

.timezone-option__label,
.modal-trigger__label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timezone-option__primary,
.choice-tile__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}

.timezone-option__secondary,
.choice-tile__subtitle {
  font-size: 0.75rem;
  color: #64748b;
}

.timezone-option__offset {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f766e;
  white-space: nowrap;
  align-self: flex-end;
}

.modal-trigger__tag {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(13, 148, 136, 0.75);
}

.modal-trigger__value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
}

.modal-shell {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
}

@media (max-width: 640px) {
  .timezone-modal,
  .modal-shell {
    padding: 0 0.5rem;
  }

  .timezone-modal__panel,
  .modal-card {
    border-radius: 1.25rem;
    max-height: 92vh;
  }

  .timezone-option,
  .choice-tile {
    padding: 0.75rem 0.85rem;
    border-radius: 1rem;
  }
}
</style>