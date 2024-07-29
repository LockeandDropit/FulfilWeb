// import { cn } from "@/lib/utils";

import { forwardRef } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


// credit https://github.com/codinginflow/nextjs-job-board/blob/Final-Project/src/components/RichTextEditor.tsx no licence listed as of 7/11/2024 but was part of a youtube tutorial
//also i dont think this is subject to copyright

export default forwardRef(
  function RichTextEditor(props, ref) {
    return (
      <Editor
        editorClassName=
          "py-3 px-4 block w-full border-gray-200 z-0 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none min-h-[160px]"
        toolbar={{
          options: ["inline", "list",],
          inline: {
            options: ["bold", "italic", "underline"],
          },
        }}
        editorRef={(r) => {
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            ref.current = r;
          }
        }}
        {...props}
      />
    );
  },
);