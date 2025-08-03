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

  const image = await Myconid.getImage(id);
  if (!image) {
    return NextResponse.json({ error: "image not found" }, { status: 404 });
  }
  console.log(image);

  const signedUrl = await Media.getMediaSignedUrl(image.mediaPath);

  if (!signedUrl) {
    return NextResponse.json({ error: "image not found" }, { status: 404 });
  }
  console.log("signed url:", signedUrl);

  // Redirect client to the signed URL
  return NextResponse.redirect(signedUrl);
}
