If you'd like to integrate the dropzone with the [Zupload](https://www.zupload.io/) the simple to use object storage provider for developers with Next.js 13, you just need to do the following:

1. sign up at https://www.zupload.io/ , free tier is 10gb storage

2. set your API key in your .env file
```jsx static 
// .env
ZUPLOAD_API_KEY='YOUR_API_KEY'
```

3. setup your API handler for zupload
```jsx static
// api/zupload/[id].ts
import { createNextApiHandler } from "@zupload/nextjs";

export default createNextApiHandler({
  apiKey: process.env.ZUPLOAD_API_KEY || "",
});
```
4. use react-dropzone and Zupload together
```jsx static
// index.tsx
import { useDownload, useUpload } from "@zupload/nextjs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const config = { bucketKey: "YOUR_BUCKET_KEY" };

type ProcessingState = "idle" | "uploading" | "downloading";
function Homepage() {
  const upload = useUpload(config);
  const download = useDownload(config);
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [fileUrl, setFileUrl] = useState<string | undefined>();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setProcessingState("uploading");
      await upload(acceptedFiles[0], acceptedFiles[0].name);
      setProcessingState("downloading");
      const { url } = await download(acceptedFiles[0].name);
      setFileUrl(url);
      setProcessingState("idle");
    },
    [download, upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
    },
  });

  return (
    <main>
      <h1>Zupload Demo</h1>
      <p>
        This demo will upload a image on drop, and then immediately download
        that image to display in the browser
      </p>
      <div
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {processingState !== "idle" && (
        <div>
          <p>
            <span>{processingState}</span> file...
          </p>
        </div>
      )}
      {fileUrl && (
        <div>
          <img src={fileUrl} alt="Uploaded file" />
        </div>
      )}
    </main>
  );
}
```

