import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Register from './Register'
import Login from './Login'
import AddListing from './AddListing'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Проверяем, есть ли уже вошедший пользователь
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    checkUser()

    // Подписка на изменения (вход/выход)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div>
      {user ? (
        <div>
          <p>Вы вошли как: {user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Выйти</button>
        </div>
      ) : (
        <>
          <Register />
          <Login />
        </>
      )}
    </div>
  )
}

export default App
{user ? (
    <div>
      <p>Вы вошли как: {user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Выйти</button>
      <AddListing />
    </div>
  ) : (
    <>
      <Register />
      <Login />
    </>
  )}
  