import { NextRequest, NextResponse } from "next/server";
import Myconid from "@/services/myconid";
import Auth from "@/services/auth";
import Media from "@/services/media";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("IMAGE ID: ", id);

  const { isValid } = await Auth.verifySession();

  if (!isValid) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const image = await Myconid.getImageByID(id);
  if (!image) {
    return NextResponse.json({ error: "image not found" }, { status: 404 });
  }
  const signedUrl = await Media.getMediaSignedUrl(image.mediaPath);

  // Redirect client to the signed URL
  return NextResponse.redirect(signedUrl);
}
