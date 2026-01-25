import Title from "../components/Title"


const Generator = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-12 mt-28">
      <form className="max-w-4xl mx-auto mb-40">
          <Title heading="Generate Contextual Image" description="Upload An Image Of Person And Product Images To Generate Stunning UGC, Short-term Videos And Commercial Reels."/>
          <div className="flex gap-20 max-sm:flex-col items-start justify-between">
            {/* left col */}
            <div className="flex flex-col w-full sm:max-w-60 gap-8 mt-8 mb-12">
              <p>
                Product Image
              </p>
              <p>
                Person Image
              </p>
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