import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="w-full h-full relative  border-b border-ui-border-base bg-gradient-to-r from-blue-200 to-blue-300">
      <div className="relative inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-5">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-semibold"
          >
            <br></br> <br></br> The Leading Tent Manufacturer!
             <br></br>
            products including Aluminum Tents, Modular Tent Structures,
            <br></br> 

          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            <br></br><br></br>
            Explore our line up of trending tents today. At the best prices.
          </Heading>
        </span>
        <a
          href="/store/"
        >
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-2xl shadow">
              Shop Now
          </button>
        </a>
        <br></br>
      </div>
    </div>
  )
}

export default Hero