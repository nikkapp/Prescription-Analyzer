import { useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"

interface AnalysisResult {
  indication: string;
  dosage: {
    status: string;
    details: string[];
  };
  conclusion: string;
  runTime: number;
}

export default function Component() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsLoading(true)
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload'
      })
      setImageUrl(newBlob.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePrescription = async () => {
    if (!imageUrl) return

    setIsLoading(true)
    // This is a placeholder. In a real application, you would send the image to your backend for analysis.
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAnalysis({
      indication: "Appropriate",
      dosage: {
        status: "Inappropriate",
        details: [
          "Metformin hydroclorid:",
          "The prescription dosage is 1000 mg, but the documented dosage is 500-850 mg once daily with meals."
        ]
      },
      conclusion: "Inappropriate",
      runTime: 13.01
    })
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Prescription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <Input type="file" onChange={handleUpload} accept="image/*" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="mt-2 text-sm text-gray-600">Drag and drop file here or click to browse</span>
          </label>
        </div>
        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={imageUrl} alt="Uploaded prescription" className="max-w-full h-auto" />
            </CardContent>
          </Card>
        )}
        <Button onClick={generatePrescription} disabled={!imageUrl || isLoading} className="w-full">
          {isLoading ? 'Processing...' : 'Generate Prescription'}
        </Button>
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Based on the information from Drugs.com, it appears that the current medication regimen may not be fully effective for the conditions listed, which could make the prescription less appropriate:
              </p>
              <div>
                <span className="font-semibold">Indication:</span> <span className="text-green-500">{analysis.indication}</span>
              </div>
              <div>
                <span className="font-semibold">Dosage:</span> <span className="text-red-500">{analysis.dosage.status}</span>
                <ul className="list-disc list-inside pl-4">
                  {analysis.dosage.details.map((detail, index) => (
                    <li key={index} className="text-sm">{detail}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Conclusion:</span> <span className="text-red-500">{analysis.conclusion}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Run time: {analysis.runTime}s
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}