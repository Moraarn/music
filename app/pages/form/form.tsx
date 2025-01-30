"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { SetStateAction, useState } from 'react'

const SongForm = () => {
  const [genres, setGenres] = useState<string[]>([]) // Updated to handle multiple genres
  const [mood, setMood] = useState('')
  const [tempo, setTempo] = useState(5)
  const [instruments, setInstruments] = useState<string[]>([])
  const [additionalDetails, setAdditionalDetails] = useState('')

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>, genreValue: string) => {
    if (e.target.checked) {
      setGenres([...genres, genreValue])
    } else {
      setGenres(genres.filter((genre) => genre !== genreValue))
    }
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Generate Your Perfect Song</h1>
      <p className="text-center text-gray-600 mb-6">Tell us the vibe, and let the AI create the perfect tune for you.</p>

      <form>
        {/* Genre */}
        <div className="mb-4">
          <Label>What genre of music do you prefer?</Label>
          <div className="space-y-2 mt-2">
            {['Pop', 'Rock', 'Jazz', 'Classical', 'EDM'].map((genre) => (
              <label key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  value={genre}
                  checked={genres.includes(genre)}
                  onChange={(e) => handleGenreChange(e, genre)}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Other"
                checked={genres.includes('Other')}
                onChange={(e) => handleGenreChange(e, 'Other')}
                className="mr-2"
              />
              Other (please describe)
            </label>
          </div>
        </div>

        {/* Mood */}
        <div className="mb-4">
          <Label htmlFor="mood">What mood or vibe are you looking for?</Label>
          <Input
            id="mood"
            value={mood}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setMood(e.target.value)}
            placeholder="e.g., Relaxing, Energetic, Happy"
            className="mt-2 w-full p-2 border rounded-md"
          />
        </div>

        {/* Tempo */}
        <div className="mb-4">
          <Label htmlFor="tempo">What tempo do you want the song to have?</Label>
          <Slider
            value={[tempo]}
            onValueChange={(value) => setTempo(value[0])}
            min={1}
            max={10}
            step={1}
            className="mt-2 w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Instruments */}
        <div className="mb-4">
          <Label>What instruments or sounds would you like to feature?</Label>
          <div className="space-x-4 mt-2">
            {['Piano', 'Guitar', 'Drums', 'Synth'].map((instrument) => (
              <label key={instrument} className="flex items-center">
                <input
                  type="checkbox"
                  value={instrument}
                  checked={instruments.includes(instrument)}
                  onChange={() => {
                    if (instruments.includes(instrument)) {
                      setInstruments(instruments.filter((item) => item !== instrument))
                    } else {
                      setInstruments([...instruments, instrument])
                    }
                  }}
                  className="mr-2"
                />
                {instrument}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                value="Other"
                checked={instruments.includes('Other')}
                onChange={() => {
                  if (instruments.includes('Other')) {
                    setInstruments(instruments.filter((item) => item !== 'Other'))
                  } else {
                    setInstruments([...instruments, 'Other'])
                  }
                }}
                className="mr-2"
              />
              Other (please describe)
            </label>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-6">
          <Label htmlFor="additional-details">Any other specifics?</Label>
          <Textarea
            id="additional-details"
            value={additionalDetails}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setAdditionalDetails(e.target.value)}
            placeholder="e.g., Rhythm, Key, Unique touches"
            className="mt-2 w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" className="bg-green-600 text-white hover:bg-green-700 p-3 rounded-full w-full">
            Generate My Song
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SongForm
