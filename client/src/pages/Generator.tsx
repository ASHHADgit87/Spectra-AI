import React, { useState } from "react"
import Title from "../components/Title"
import UploadZone from "../components/UploadZone"


const Generator = () => {
  const [name,setName] = useState('');
  const [productName,setProductName] = useState('');
  const [productDescription,setProductDescription] = useState('');
  const [aspectRatio,setAspectRatio] = useState('9:16');
    const [productImage,setProductImage] = useState<File | null>(null);
  const [modelImage,setModelImage] = useState<File | null>(null);
  const [userPrompt,setUserPrompt] = useState('');
  const [isGenerating,setIsGenerating] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> ,type : 'product' | 'model') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'product') {
        setProductImage(e.target.files[0]);
      } else {
        setModelImage(e.target.files[0]);
      }
    }
  }
  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-28">
      <form className="max-w-4xl mx-auto mb-40">
          <Title heading="Generate Contextual Image" description="Upload An Image Of Person And Product Images To Generate Stunning UGC, Short-term Videos And Commercial Reels."/>
          <div className="flex gap-20 max-sm:flex-col items-start justify-between">
            {/* left col */}
            <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
              <UploadZone label="Upload Product Image" file={} onClear={() => {}} onChange={(e) => {}}/>
            </div>
            {/* Right col */}
            <div>
              <p>
                Right Col
              </p>
            </div>
          </div>
      </form>
    </div>
  )
}

export default Generator