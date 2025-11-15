<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Work Logs</h2>
                <p class="text-sm text-gray-500">Review submitted hours and manage approvals directly from this page.</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-sm">
                    <p class="text-xs uppercase font-semibold text-teal-700">Total Hours</p>
                    <p class="text-xl font-bold text-teal-800 mt-1">{{ totalLoggedHours.toFixed(1) }}h</p>
                  </div>
                  <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
                    <p class="text-xs uppercase font-semibold text-blue-700">Last 7 Days</p>
                    <p class="text-xl font-bold text-blue-800 mt-1">{{ weeklyLoggedHours.toFixed(1) }}h</p>
                  </div>
                </div>
                <button
                  @click="downloadWorkLogs"
                  class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Logs
                </button>
              </div>
            </div>
