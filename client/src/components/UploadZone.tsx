import type { UploadZoneProps } from "../types"

const UploadZone = ({label,file,onClear,onChange}: UploadZoneProps) => {
  return (
    <div className="relative group">
      <div className= {`relative h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-white/2 p-6 ${file ? "border-violet-600/50 bg-violet-500/5" : "border-white/10 hover:border-violet-500/30 hover:bg-white/5"}`}>

      </div>
    </div>
  )
}

export default UploadZone