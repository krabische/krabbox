import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

export default function AddListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')

  // Загружаем каждое фото в Supabase Storage
  const uploadImages = async () => {
    const urls = []
    for (const file of images) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (error) {
        console.error(error)
        continue
      }
      const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl
      urls.push(publicUrl)
    }
    return urls
  }

  const handleCreateListing = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      setMessage('❌ Сначала войдите в аккаунт')
      return
    }

    // Загружаем картинки
    const imageUrls = await uploadImages()

    // Создаём объявление
    const { data: listing, error } = await supabase
      .from('listings')
      .insert([{ title, description, price, location, owner_id: user.id }])
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      return
    }

    // Добавляем картинки
    const imagesData = imageUrls.map(url => ({ listing_id: listing.id, image_url: url }))
    const { error: imgError } = await supabase.from('listing_images').insert(imagesData)
    if (imgError) {
      setMessage(imgError.message)
      return
    }

    setMessage('✅ Объявление добавлено!')
  }

  return (
    <div>
      <h2>Добавить объявление</h2>
      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Местоположение" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
      <button onClick={handleCreateListing}>Создать</button>
      <p>{message}</p>
    </div>
  )
}
