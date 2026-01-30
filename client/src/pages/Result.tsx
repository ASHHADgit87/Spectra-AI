import { use, useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Result = () => {
  const [project, setProjectData] = useState<Project>({} as Project);
  const [loading,setLoading] = useState(true);
  const [isGenerating,setIsGenerating] = useState(false);
  const fetchProjectData = async () =>{
    setTimeout(() => {
      setProjectData(dummyGenerations[0]);
      setLoading(false);
    },3000)
  }
  useEffect(() => {
    fetchProjectData();
  },[])
  return loading ? (
    <div className="h-screen w-full flex items-center justify-center">
       <Loader2Icon className="size-7 animate-spin text-indigo-400"/>
    </div>
  ):(
    <div className="min-h-screen text-white p-6 md:p-12 mt-20">
      <div className="max-w-6xl mx-auto">
           <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font -medium">Generation Result</h1>
           <Link to='/generate' className="btn-secondary text-sm flex items-center gap-2">
           <RefreshCwIcon className="w-4 h-4"/>
           <p className="max-sm:hidden">New Generation</p>
           </Link>
           </header>
           <div className="grid lg:grid-cols-3 gap-8">
             {/*main result */}
             <div>
              
             </div>
             {/*sidebar actions */}
             <div>

             </div>
           </div>
      </div>
    </div>
  )
}

export default Result