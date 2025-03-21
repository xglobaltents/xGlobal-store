import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="90px" height="34.2px" viewBox="0 0 1250.000000 475.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,475.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M1912 3942 c-442 -438 -803 -801 -802 -807 0 -5 161 -171 357 -367 l358 -358 -245 0 -245 0 -237 237 -238 238 -355 -355 -355 -355 167 -7 168 -7 187 187 188 187 183 -183 182 -182 625 0 625 0 -490 490 -490 490 795 795 795 795 -185 0 -185 -1 -803 -797z"></path><path d="M4950 3285 l0 -1125 215 0 215 0 0 1125 0 1125 -215 0 -215 0 0 -1125z"></path><path d="M7740 3285 l0 -1125 215 0 215 0 0 111 0 111 74 -69 c82 -77 182 -132 286 -160 89 -24 291 -24 380 0 213 56 396 216 496 431 56 122 75 213 81 381 11 305 -63 514 -247 697 -73 72 -102 93 -181 131 -117 57 -208 77 -342 77 -191 0 -342 -58 -474 -184 l-73 -69 0 397 0 396 -215 0 -215 0 0 -1125z m1005 188 c137 -41 250 -165 291 -318 18 -68 18 -227 -1 -300 -36 -137 -128 -249 -252 -308 -63 -30 -76 -32 -173 -32 -97 0 -110 2 -173 32 -124 59 -216 171 -252 308 -18 69 -20 202 -4 277 55 265 309 418 564 341z"></path><path d="M11860 3285 l0 -1125 215 0 215 0 0 1125 0 1125 -215 0 -215 0 0 -1125z"></path><path d="M3397 4295 c-360 -63 -657 -294 -793 -615 -95 -226 -115 -510 -53 -752 76 -300 286 -556 563 -683 316 -147 712 -138 1006 22 236 127 413 343 494 601 24 78 26 96 26 278 l0 194 -575 0 -575 0 0 -165 0 -165 360 0 c415 0 381 11 333 -108 -75 -191 -219 -319 -400 -357 -87 -19 -249 -19 -337 0 -154 33 -318 151 -394 285 -61 109 -85 201 -90 351 -6 168 12 269 68 385 52 108 114 182 204 242 111 74 176 94 331 99 145 6 217 -7 313 -53 63 -31 170 -127 197 -178 l20 -36 247 0 248 0 -26 68 c-111 296 -358 498 -704 578 -93 21 -365 27 -463 9z"></path><path d="M6370 3855 c-331 -68 -571 -296 -652 -620 -31 -126 -31 -341 0 -468 84 -339 324 -562 669 -622 328 -57 674 66 857 304 246 319 246 796 1 1109 -121 155 -309 264 -519 301 -81 15 -276 12 -356 -4z m269 -365 c75 -14 155 -57 212 -113 91 -89 132 -203 133 -367 0 -58 -6 -130 -13 -160 -33 -136 -120 -247 -239 -303 -64 -30 -73 -32 -187 -32 -115 0 -122 1 -180 32 -101 53 -167 130 -206 238 -27 76 -37 266 -20 357 48 247 259 394 500 348z"></path><path d="M10270 3850 c-272 -71 -469 -278 -551 -580 -21 -75 -23 -107 -23 -265 1 -193 11 -256 68 -395 76 -190 235 -352 416 -426 260 -105 568 -51 760 134 l70 67 0 -112 0 -113 220 0 220 0 -2 843 -3 842 -215 0 -215 0 -5 -115 c-4 -99 -7 -112 -18 -93 -19 34 -139 127 -209 162 -140 71 -352 92 -513 51z m420 -372 c156 -46 278 -182 310 -346 18 -91 8 -262 -19 -334 -47 -121 -144 -218 -266 -264 -37 -14 -76 -19 -151 -19 -95 0 -104 2 -175 37 -167 83 -259 244 -259 453 0 159 50 286 147 375 112 102 270 140 413 98z"></path><path d="M241 3509 c129 -132 263 -272 299 -310 l65 -70 134 134 134 135 -179 176 -179 175 -254 1 -253 0 233 -241z"></path><path d="M5707 1620 c-31 -10 -73 -30 -91 -44 -104 -79 -123 -244 -38 -338 44 -48 76 -65 220 -113 137 -45 172 -71 172 -127 0 -21 -5 -48 -10 -59 -16 -29 -64 -49 -121 -49 -45 0 -55 4 -85 34 -19 19 -34 43 -34 55 0 20 -5 21 -101 21 l-101 0 7 -37 c27 -144 167 -232 349 -220 125 8 204 50 254 136 23 40 27 57 27 127 0 71 -3 85 -28 122 -35 54 -99 90 -241 136 -153 49 -196 93 -166 167 28 66 142 80 200 24 17 -16 30 -37 30 -47 0 -16 10 -18 101 -18 l101 0 -7 38 c-16 90 -90 168 -187 197 -69 20 -179 18 -251 -5z"></path><path d="M11837 1620 c-31 -10 -73 -30 -91 -44 -104 -79 -123 -244 -38 -338 44 -48 76 -65 220 -113 137 -45 172 -71 172 -127 0 -21 -5 -48 -10 -59 -16 -29 -64 -49 -121 -49 -45 0 -55 4 -85 34 -19 19 -34 43 -34 55 0 20 -5 21 -101 21 l-101 0 7 -37 c27 -144 167 -232 349 -220 125 8 204 50 254 136 23 40 27 57 27 127 0 71 -3 85 -28 122 -35 54 -99 90 -241 136 -153 49 -196 93 -166 167 28 66 142 80 200 24 17 -16 30 -37 30 -47 0 -16 10 -18 101 -18 l101 0 -7 38 c-16 90 -90 168 -187 197 -69 20 -179 18 -251 -5z"></path><path d="M237 1623 c-4 -3 -7 -201 -7 -440 l0 -433 90 0 90 0 0 440 0 440 -83 0 c-46 0 -87 -3 -90 -7z"></path><path d="M1140 1190 l0 -440 90 0 90 0 2 297 3 297 195 -297 195 -296 93 0 92 -1 0 440 0 440 -90 0 -90 0 -2 -297 -3 -297 -195 297 -195 297 -92 0 -93 0 0 -440z"></path><path d="M2637 1623 c-4 -3 -7 -202 -7 -440 l0 -435 223 4 c246 4 282 12 384 82 200 137 230 472 58 655 -104 111 -203 141 -470 141 -100 0 -185 -3 -188 -7z m429 -168 c94 -39 145 -121 152 -243 8 -145 -32 -228 -134 -278 -48 -24 -72 -28 -165 -32 l-109 -5 0 293 0 293 108 -6 c66 -3 125 -12 148 -22z"></path><path d="M4092 1313 c5 -374 6 -383 98 -475 48 -48 68 -60 129 -78 195 -60 397 23 462 187 22 56 23 70 23 368 l1 310 -90 0 -90 0 -5 -310 c-3 -208 -9 -317 -17 -330 -52 -91 -209 -111 -284 -36 -44 44 -49 83 -49 394 l0 287 -91 0 -90 0 3 -317z"></path><path d="M6830 1555 l0 -75 115 0 115 0 0 -365 0 -365 90 0 90 0 0 365 0 364 118 3 117 3 0 70 0 70 -322 3 -323 2 0 -75z"></path><path d="M8167 1623 c-4 -3 -7 -201 -7 -440 l0 -433 90 0 90 0 0 170 0 170 43 0 42 0 95 -170 95 -170 103 0 c56 0 102 2 102 4 0 3 -43 77 -95 166 -53 88 -98 166 -100 173 -3 7 13 19 40 31 54 22 117 90 133 144 27 89 6 207 -46 266 -30 33 -90 66 -149 81 -59 15 -422 22 -436 8z m400 -160 c61 -28 82 -117 43 -181 -27 -44 -54 -52 -171 -52 l-99 0 0 125 0 125 96 0 c69 0 106 -5 131 -17z"></path><path d="M9537 1623 c-4 -3 -7 -201 -7 -440 l0 -433 90 0 90 0 0 440 0 440 -83 0 c-46 0 -87 -3 -90 -7z"></path><path d="M10440 1190 l0 -440 260 0 261 0 -3 73 -3 72 -167 3 -168 2 0 110 0 110 150 0 150 0 0 75 0 75 -150 0 -150 0 0 105 0 105 170 0 170 0 0 75 0 75 -260 0 -260 0 0 -440z"></path></g></svg>
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <div className="cart-icon">
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart  (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            </div>
          </div>
        </nav>
        <div className="scrollHorizantal">
                    <a href="#">Contact Sales Center</a>
                    <a href="#">Get Rental Quote Today</a>
        </div>
      </header>
    </div>
  )
}
