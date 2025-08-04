import { Image } from "@myconid/store/types";
import Heading from "./Heading";
import ImageCard from "./ImageCard";

type Props = {
  title?: string;
  images: Image[];
};
const ImageGrid: React.FC<Props> = ({ title, images }) => {
  return (
    <div>
      {title && <Heading level="h2">{title}</Heading>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded p-4 text-center"
          >
            <ImageCard image={image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
