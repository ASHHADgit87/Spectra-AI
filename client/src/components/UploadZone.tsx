import type { UploadZoneProps } from "../types"

const UploadZone = ({label,file,onClear,onChange}: UploadZoneProps) => {
  return (
    <div className="relative group">
      <div className= {`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/2 p-6`}>

      </div>
    </div>
  )
}

export default UploadZone