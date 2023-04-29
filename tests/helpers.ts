import { agent as _request } from "supertest"
import { get as getApplication } from "@root/app"

export const request = _request(getApplication())