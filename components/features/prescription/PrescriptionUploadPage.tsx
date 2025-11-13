// components/features/prescription/PrescriptionUploadPage.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Upload, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Pill,
  User,
  Calendar,
  Stethoscope
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function PrescriptionUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    prescriptionDate: '',
    additionalNotes: ''
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, or PDF files only.",
          variant: "destructive"
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive"
        })
        return
      }

      setUploadedFile(file)
      toast({
        title: "File uploaded",
        description: `${file.name} has been successfully uploaded.`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!uploadedFile) {
        throw new Error('Please upload a prescription file')
      }
      if (!formData.patientName || !formData.doctorName || !formData.prescriptionDate) {
        throw new Error('Please fill in all required fields')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // TODO: Integrate with backend for actual file upload
      console.log('Prescription data:', {
        ...formData,
        file: uploadedFile
      })

      toast({
        title: "Prescription Submitted!",
        description: "Your prescription has been received and is being processed.",
      })

      // Redirect to shop or confirmation page
      router.push('/shop?prescription=uploaded')
      
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your prescription.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const Features = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center mb-8">Why Upload Your Prescription?</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Secure & Confidential</h4>
            <p className="text-muted-foreground">
              Your medical information is protected with HIPAA-compliant security measures.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Fast Processing</h4>
            <p className="text-muted-foreground">
              Prescriptions are typically verified within 2-4 hours during business days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Expert Verification</h4>
            <p className="text-muted-foreground">
              Licensed pharmacists review every prescription for accuracy and safety.
            </p>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
            <AlertCircle className="h-5 w-5" />
            Prescription Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Clear, readable image or PDF of your prescription
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Doctor's signature and contact information
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Patient name and prescription date
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Medication name, strength, and dosage instructions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <Pill className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PharmaCare</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold">Upload Your Prescription</h1>
            <p className="mt-2 text-muted-foreground text-lg">
              Secure and convenient prescription submission for your medication needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Prescription Details
                  </CardTitle>
                  <CardDescription>
                    Fill in your prescription information and upload a clear copy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload */}
                    <div className="space-y-4">
                      <Label htmlFor="prescription-file">Upload Prescription *</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-primary/50">
                        <input
                          type="file"
                          id="prescription-file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="prescription-file" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {uploadedFile ? uploadedFile.name : 'Click to upload prescription'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                JPG, PNG, or PDF (Max 5MB)
                              </p>
                            </div>
                            {!uploadedFile && (
                              <Button variant="outline" type="button">
                                Choose File
                              </Button>
                            )}
                          </div>
                        </label>
                      </div>
                      {uploadedFile && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          File uploaded successfully
                        </div>
                      )}
                    </div>

                    {/* Patient Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="patientName">Patient Full Name *</Label>
                          <Input
                            id="patientName"
                            value={formData.patientName}
                            onChange={(e) => handleInputChange('patientName', e.target.value)}
                            placeholder="Enter patient's full name as on prescription"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="doctorName">Doctor's Name *</Label>
                          <Input
                            id="doctorName"
                            value={formData.doctorName}
                            onChange={(e) => handleInputChange('doctorName', e.target.value)}
                            placeholder="Enter prescribing doctor's name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prescriptionDate">Prescription Date *</Label>
                          <Input
                            id="prescriptionDate"
                            type="date"
                            value={formData.prescriptionDate}
                            onChange={(e) => handleInputChange('prescriptionDate', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                          <Textarea
                            id="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                            placeholder="Any special instructions or notes for the pharmacist..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !uploadedFile}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing Prescription...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Submit Prescription
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Your Privacy is Protected</h4>
                      <p className="text-sm text-green-700 mt-1">
                        All prescription data is encrypted and handled in compliance with healthcare privacy 
                        regulations. Only authorized pharmacists can access your information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features & Information */}
            <div>
              <Features />
            </div>
          </div>

          {/* Support Information */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Processing Time</h4>
                    <p className="text-sm text-muted-foreground">2-4 hours during business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Verification Rate</h4>
                    <p className="text-sm text-muted-foreground">99% of prescriptions approved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Pharmacist Support</h4>
                    <p className="text-sm text-muted-foreground">Available 24/7 for questions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}