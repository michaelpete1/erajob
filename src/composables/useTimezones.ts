export interface TimezoneOption {
  label: string
  value: string
  searchText: string
}

const zones: Array<{ offset: string; display: string; cities: string[] }> = [
  { offset: 'UTC-12:00', display: '(GMT-12:00) International Date Line West', cities: ['Baker Island'] },
  { offset: 'UTC-11:00', display: '(GMT-11:00) Midway Island, Samoa', cities: ['Midway', 'Pago Pago'] },
  { offset: 'UTC-10:00', display: '(GMT-10:00) Hawaii', cities: ['Honolulu', 'Papeete'] },
  { offset: 'UTC-09:30', display: '(GMT-09:30) Marquesas Islands', cities: ['Taiohae'] },
  { offset: 'UTC-09:00', display: '(GMT-09:00) Alaska', cities: ['Anchorage'] },
  { offset: 'UTC-08:00', display: '(GMT-08:00) Pacific Time (US & Canada)', cities: ['Los Angeles', 'Vancouver', 'Tijuana'] },
  { offset: 'UTC-07:00', display: '(GMT-07:00) Mountain Time (US & Canada)', cities: ['Denver', 'Phoenix', 'Calgary'] },
  { offset: 'UTC-06:00', display: '(GMT-06:00) Central Time (US & Canada)', cities: ['Chicago', 'Mexico City', 'Guatemala'] },
  { offset: 'UTC-05:00', display: '(GMT-05:00) Eastern Time (US & Canada)', cities: ['New York', 'Toronto', 'Bogotá'] },
  { offset: 'UTC-04:30', display: '(GMT-04:30) Caracas', cities: ['Caracas'] },
  { offset: 'UTC-04:00', display: '(GMT-04:00) Atlantic Time (Canada)', cities: ['Halifax', 'Santo Domingo', 'San Juan'] },
  { offset: 'UTC-03:30', display: '(GMT-03:30) Newfoundland', cities: ['St. John’s'] },
  { offset: 'UTC-03:00', display: '(GMT-03:00) Brasilia, Buenos Aires', cities: ['São Paulo', 'Buenos Aires', 'Montevideo'] },
  { offset: 'UTC-02:00', display: '(GMT-02:00) Mid-Atlantic', cities: ['South Georgia'] },
  { offset: 'UTC-01:00', display: '(GMT-01:00) Azores', cities: ['Azores', 'Cape Verde'] },
  { offset: 'UTC+00:00', display: '(GMT+00:00) Greenwich Mean Time', cities: ['London', 'Lisbon', 'Casablanca'] },
  { offset: 'UTC+01:00', display: '(GMT+01:00) Central European Time', cities: ['Amsterdam', 'Berlin', 'Rome', 'Stockholm', 'Vienna'] },
  { offset: 'UTC+02:00', display: '(GMT+02:00) Eastern European Time', cities: ['Athens', 'Jerusalem', 'Cairo', 'Johannesburg'] },
  { offset: 'UTC+03:00', display: '(GMT+03:00) Moscow, Nairobi', cities: ['Moscow', 'Nairobi', 'Doha'] },
  { offset: 'UTC+03:30', display: '(GMT+03:30) Tehran', cities: ['Tehran'] },
  { offset: 'UTC+04:00', display: '(GMT+04:00) Gulf Standard Time', cities: ['Dubai', 'Baku'] },
  { offset: 'UTC+04:30', display: '(GMT+04:30) Kabul', cities: ['Kabul'] },
  { offset: 'UTC+05:00', display: '(GMT+05:00) Pakistan Standard Time', cities: ['Karachi', 'Tashkent'] },
  { offset: 'UTC+05:30', display: '(GMT+05:30) India Standard Time', cities: ['New Delhi', 'Mumbai', 'Colombo'] },
  { offset: 'UTC+05:45', display: '(GMT+05:45) Nepal Time', cities: ['Kathmandu'] },
  { offset: 'UTC+06:00', display: '(GMT+06:00) Bangladesh Standard Time', cities: ['Dhaka', 'Astana'] },
  { offset: 'UTC+06:30', display: '(GMT+06:30) Yangon', cities: ['Yangon'] },
  { offset: 'UTC+07:00', display: '(GMT+07:00) Indochina Time', cities: ['Bangkok', 'Jakarta', 'Hanoi'] },
  { offset: 'UTC+08:00', display: '(GMT+08:00) China Standard Time', cities: ['Beijing', 'Singapore', 'Perth'] },
  { offset: 'UTC+08:45', display: '(GMT+08:45) Southeastern Western Australia', cities: ['Eucla'] },
  { offset: 'UTC+09:00', display: '(GMT+09:00) Japan/Korea Standard Time', cities: ['Tokyo', 'Seoul'] },
  { offset: 'UTC+09:30', display: '(GMT+09:30) Australian Central Time', cities: ['Adelaide', 'Darwin'] },
  { offset: 'UTC+10:00', display: '(GMT+10:00) Australian Eastern Time', cities: ['Sydney', 'Brisbane', 'Port Moresby'] },
  { offset: 'UTC+10:30', display: '(GMT+10:30) Lord Howe Island', cities: ['Lord Howe Island'] },
  { offset: 'UTC+11:00', display: '(GMT+11:00) Solomon Islands', cities: ['Guadalcanal', 'Nouméa'] },
  { offset: 'UTC+11:30', display: '(GMT+11:30) Norfolk Island', cities: ['Kingston'] },
  { offset: 'UTC+12:00', display: '(GMT+12:00) New Zealand Standard Time', cities: ['Auckland', 'Fiji'] },
  { offset: 'UTC+12:45', display: '(GMT+12:45) Chatham Islands', cities: ['Waitangi'] },
  { offset: 'UTC+13:00', display: '(GMT+13:00) Tonga', cities: ['Nukuʻalofa'] },
  { offset: 'UTC+14:00', display: '(GMT+14:00) Line Islands', cities: ['Kiritimati'] },
]

export function useTimezones(): TimezoneOption[] {
  return zones.map((zone) => ({
    label: `${zone.display} • ${zone.cities.slice(0, 3).join(', ')}`,
    value: zone.offset,
    searchText: [zone.display, zone.offset, ...zone.cities].join(' ').toLowerCase(),
  }))
}
