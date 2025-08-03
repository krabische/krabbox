import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('✅ Регистрация успешна! Проверьте почту для подтверждения.')
    }
  }

  return (
    <div>
      <h2>Регистрация</h2>
      <input
        type="email"
        placeholder="Введите email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Введите пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Зарегистрироваться</button>
      <p>{message}</p>
    </div>
  )
}
