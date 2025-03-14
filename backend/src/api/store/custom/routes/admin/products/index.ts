import { Router } from "express"
import { POST as updateProduct } from "./update-product"

const router = Router()

export default (app) => {
  router.post("/:id", updateProduct)
  return router
}