import { agent as _request } from "supertest"
import { getApplication } from "@root/app"

export const request = _request(getApplication())