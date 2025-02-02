import { Button, Input } from "components/ui";
import { useState } from "react";

const TestPage = () => {
  const [url, setUrl] = useState(
    "https://codesandbox.io/p/devbox/swiper-react-autoplay-pdrc53"
  );
  const [iframeUrl, setIframeUrl] = useState("");

  const handleLoadURL = () => {
    if (url.trim() !== "") {
      setIframeUrl(url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-80"
        />
        <Button variant="solid" onClick={handleLoadURL}>
          Load
        </Button>
      </div>
      {iframeUrl && (
        <iframe
          src={iframeUrl}
          className="w-full h-[700px] border rounded"
          title="URL Viewer"
        ></iframe>
      )}
    </div>
  );
};
export default TestPage;
