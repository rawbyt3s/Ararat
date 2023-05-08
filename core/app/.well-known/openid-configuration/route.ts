import { NextResponse } from "next/server"
import {Issuer} from "openid-client";
export async function GET(req, res) {
    let issuer = await Issuer.discover("http://127.0.0.1:3002")
    return NextResponse.json(JSON.parse(JSON.stringify(issuer.metadata).replaceAll("http://127.0.0.1:3002", "https://" + req.headers.get("host"))))
}