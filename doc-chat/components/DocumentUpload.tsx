'use client'

import { ChangeEvent, FormEvent, SetStateAction, useState } from 'react';
import { createClientComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState<string>('')
  const supabase: SupabaseClient = createClientComponentClient()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !title) return

    const user = await supabase.auth.getUser()
    const userId = user.data.user?.id
    if (!userId) return

    const fileName = `${userId}/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error)
      return
    }

    const { data: publicURLData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    // if (urlError) {
    //   console.error('Error getting public URL:', urlError)
    //   return
    // }

    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: title,
        blob_url: publicURLData.publicUrl,
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
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
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
