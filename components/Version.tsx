import packageJson from "../package.json"; // Adjust path as needed

const Version = () => {
  return (
    <div className="ml-auto mr-4 mb-2 xl:my-auto">
      <a href="/changelog">
        <label className="text-base cursor-pointer">
          Version: {packageJson.version}
        </label>
      </a>
    </div>
  );
};

export default Version;
