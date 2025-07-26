import { NextRequest, NextResponse } from "next/server";
import Myconid from "../../../services/core";
import Auth from "../../../services/auth";

export async function GET(request: NextRequest) {
  const { userId, isValid } = await Auth.verifySession(request);

  if (!isValid) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  console.log("getting images for ", userId);

  const images = await Myconid.getImagesByUserID(userId).catch((err) => {
    console.error(`error getting images for user id "${userId}"`, err);
    return NextResponse.json(
      { error: "error retrieving images" },
      { status: 500 }
    );
  });

  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  // validate session token
  const { userId, isValid } = await Auth.verifySession(request);

  if (!isValid) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  if (!file) {
    return NextResponse.json(
      { error: "missing file or userId" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const image = await Myconid.createImage(userId, file.name, file.type, buffer);

  return NextResponse.json({ success: true, data: image });
}
