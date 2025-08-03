import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function BookListing({ listingId }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [message, setMessage] = useState('')

  const handleBooking = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      setMessage('❌ Сначала войдите в аккаунт')
      return
    }

    const { error } = await supabase.from('bookings').insert([{
      listing_id: listingId,
      user_id: user.id,
      start_date: startDate,
      end_date: endDate
    }])

    if (error) {
      setMessage(error.message)
      return
    }
    setMessage('✅ Бронирование успешно создано!')
  }

  return (
    <div>
      <h3>Забронировать</h3>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={handleBooking}>Забронировать</button>
      <p>{message}</p>
    </div>
  )
}
