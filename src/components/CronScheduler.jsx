//TODO: Delete this file

//credit: https://www.juansuarez.me/blog/React/react-custom-date-picker
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm, useFormContext } from "react-hook-form";
import '..styles/CronScheduler.css'

const CronScheduler = (p) => {
  const { setValue, register } = useFormContext();
  const [frequency, setFrequency] = useState(p.frequency)
  const [time, setTime] = useState(`${p.hour}:${p.minute}`)
  const [days, setDays] = useState(p.days)
  const [months, setMonths] = useState(p.months)

  // Refs to store the previous state values
  const prevFrequency = useRef(p.frequency)
  const prevTime = useRef(`${p.hour}:${p.minute}`)
  const prevDays = useRef(p.days)
  const prevMonths = useRef(p.months)

  console.log('Frequency: ', frequency)
  console.log('Days: ', days)
  console.log('Months: ', months)

  const handleSave = useCallback(() => {
    let [hour, minute] = time.split(':')
    let day_of_week = days?.filter((i) => i !== '').join(',')
    let day_of_month = months.filter((i) => i !== '').join(',')
    let frequencyObject = {
      type: frequency,
      hour: hour,
      minute: minute,
      day_of_week: day_of_week,
      day: day_of_month,
    }
    // Call the onSave prop with the frequency object
    p.onSave(frequencyObject)
  }, [time, days, months, frequency, p])

  useEffect(() => {
    // Function to compare arrays
    const arraysEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

    // Check if any value is different from its previous value
    if (
      frequency !== prevFrequency.current ||
      time !== prevTime.current ||
      !arraysEqual(days, prevDays.current) ||
      !arraysEqual(months, prevMonths.current)
    ) {
      handleSave()
    }

    // Update refs with current state
    prevFrequency.current = frequency
    prevTime.current = time
    prevDays.current = days
    prevMonths.current = months
  }, [frequency, time, days, months, handleSave])
  return (
    <div className="cron-scheduler">
      <label>
        <b>Select Frequency:</b>
      </label>
      <select
        disabled={p.disabled}
        value={frequency}
        onChange={(e) => {
          setFrequency(e.target.value)
          setDays([])
          setMonths([])
        }}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <label>
        <b>Select Time:</b>
      </label>
      <input
        disabled={p.disabled}
        type="time"
        value={time}
        onChange={(e) => {
          console.log('TIME:', e.target.value)
          setTime(e.target.value)
        }}
      />

      {frequency === 'weekly' && (
        <div className={`day-selector ${p.disabled ? 'disabled' : ''}`}>
          {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day, index) => (
            <div
              key={index}
              className={`day ${days.includes(day) ? 'selected' : ''} ${
                p.disabled ? 'disabled' : ''
              }`}
              onClick={() => {
                if (!p.disabled) {
                  if (days.includes(day)) setDays((prevDays) => prevDays.filter((d) => d !== day))
                  else setDays((prevDays) => [...prevDays, day])
                }
              }}
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {frequency === 'monthly' && (
        <div className={`day-selector ${p.disabled ? 'disabled' : ''}`}>
          {Array.from({ length: 31 }).map((_, index) => (
            <div
              key={index}
              className={`day ${months.includes(String(index + 1)) ? 'selected' : ''} ${
                p.disabled ? 'disabled' : ''
              }`}
              onClick={() => {
                if (!p.disabled) {
                  if (months.includes(String(index + 1))) {
                    setMonths((prevMonths) => prevMonths.filter((m) => m !== String(index + 1)))
                  } else {
                    setMonths((prevMonths) => [...prevMonths, String(index + 1)])
                  }
                }
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CronScheduler
