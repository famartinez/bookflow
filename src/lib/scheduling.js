// Pure scheduling helpers — no React, no network. Easy to reason about and test.

// Generate the next N available workdays for a profile, starting today.
export function upcomingDays(profile, count = 14) {
  const days = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let guard = 0
  while (days.length < count && guard < 60) {
    guard++
    const dow = cursor.getDay()
    if (profile.workdays.includes(dow)) {
      days.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// Build all slot start times for a given day, as Date objects in local time.
export function slotsForDay(profile, day) {
  const slots = []
  const { day_start, day_end, slot_minutes } = profile
  const now = new Date()
  for (let h = day_start; h < day_end; h++) {
    for (let m = 0; m < 60; m += slot_minutes) {
      const slot = new Date(day)
      slot.setHours(h, m, 0, 0)
      // skip slots in the past
      if (slot.getTime() > now.getTime()) slots.push(slot)
    }
  }
  return slots
}

export function endTime(profile, start) {
  return new Date(start.getTime() + profile.slot_minutes * 60000)
}

export function fmtTime(d) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function fmtDay(d) {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function fmtDayShort(d) {
  return {
    dow: d.toLocaleDateString(undefined, { weekday: 'short' }),
    date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }
}
