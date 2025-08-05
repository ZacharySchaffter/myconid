type Props = {
  title?: string;
  message?: string;
  className?: string;
};

const EmptyCollection: React.FC<Props> = ({
  title = "No uploads yet!",
  message = "Use the button above to get started",
  className = "",
}) => {
  return (
    <div
      className={`border border-dashed border-gray-300 rounded-md p-6 text-center text-gray-600 bg-gray-50 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default EmptyCollection;
