If you'd like to integrate the dropzone with the [Zupload](https://www.zupload.io/) the simple to use object storage provider for developers with Next.js 13, you just need to do the following:

1. sign up at https://www.zupload.io/ , free tier is 10gb storage

2. set your API key in your .env file
```jsx static 
// .env
ZUPLOAD_API_KEY='YOUR_API_KEY'
ZUPLOAD_BUCKET_KEY='YOUR_BUCKET_KEY`
```

3. setup your File Route Handlers and API handler
```jsx static
// /lib/zupload/routes.ts
import { createZuploadRoute } from '@zupload/nextjs'
import { NextApiRequest } from 'next'
 
// Used on the server
export const fileRouter = createZuploadRoute<NextApiRequest>()
    .route('files')
    // Set a maxfile size of 1GB
    .maxFileSize(1024 * 1024 * 1024)
    // Accept all files
    .fileTypes(['*'])
    .bucketKey(process.env.ZUPLOAD_BUCKET_KEY)
 
// Used on the client
export const fileRouterConfig = fileRouter.getClientConfig();


// /api/zupload/[...id].ts
import { createNextApiHandler } from '@zupload/nextjs';
import { fileRouter } from '@lib/zupload/routes'
 
export default createNextApiHandler({
    apiKey: process.env.ZUPLOAD_API_KEY,
    routes: [fileRouter],
});

```
4. use react-dropzone and Zupload together
```jsx static
// index.tsx
import { fileRouterConfig } from "@/lib/zupload/routes";
import { useZupload } from "@zupload/nextjs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type ProcessingState = "idle" | "uploading" | "downloading";
function Homepage() {
  const { upload, download } = useZupload(fileRouterConfig);
  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");
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
    <main className="p-16">
      <h1 className="leading-8 text-2xl">Zupload Demo</h1>
      <p className="mt-2 mb-6">
        This demo will upload a image on drop, and then immediately download
        that image to display in the browser
      </p>
      <div
        {...getRootProps()}
        className="border border-dashed rounded-md p-16 cursor-pointer hover:border-orange-500 hover:text-orange-500"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {processingState !== "idle" && (
        <div className="mt-6 flex items-center">
          <p>
            <span className="capitalize">{processingState}</span> file...
          </p>
          <div className=" ml-6 animate-spin h-4 w-4 bg-white" />
        </div>
      )}
      {fileUrl && (
        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fileUrl} alt="Uploaded file" />
        </div>
      )}
    </main>
  );
}
```

