'use client'

import { SetStateAction, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DocumentUpload() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const supabase = createClientComponentClient()

  const handleFileChange = (e: { target: { files: SetStateAction<null>[]; }; }) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    if (!file || !title) return

    const user = await supabase.auth.getUser()
    const fileName = `${user.data.user?.id}/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error)
      return
    }

    const { publicURL, error: urlError } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    if (urlError) {
      console.error('Error getting public URL:', urlError)
      return
    }

    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user.data.user?.id,
        title: title,
        blob_url: publicURL,
      })

    if (insertError) {
      console.error('Error inserting document record:', insertError)
    } else {
      setFile(null)
      setTitle('')
      alert('Document uploaded successfully!')
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <Input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="file"
        onChange={handleFileChange}
        required
      />
      <Button type="submit">Upload Document</Button>
    </form>
  )
}