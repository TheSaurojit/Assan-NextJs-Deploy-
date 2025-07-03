// components/CKEditor.tsx
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { FirestoreService } from "@/backend/firebase/firestoreService";

interface CKEditorComponentProps {
  onChange?: (data: string) => void;
  data?: string;
  placeholder?: string;
}

class MyUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file: File = await this.loader.file;

    // Upload the file to Firestore/Storage
    const url = await FirestoreService.uploadFile(file, "image");

    return {
      default: url, // CKEditor uses this URL to insert the media
    };
  }

  abort() {
    // Optional: handle abort (e.g., cancel upload request)
  }
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  onChange,
  data = "",
  placeholder = "Start writing...",
}) => {
  const [editorData, setEditorData] = useState<string>(data);

  function CustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader);
    };
  }

  return (
    <div className="ck-editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event: any, editor: any) => {
          const data: string = editor.getData();
          setEditorData(data);
          if (onChange) {
            onChange(data);
          }
        }}
        onReady={(editor: any) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        config={{
          licenseKey: "GPL",
          placeholder,
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "uploadImage",
              "|",
              "fontfamily",
              "fontsize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "alignment",
              "outdent",
              "indent",
              "|",
              "blockQuote",
              "link",
              "|",
              "undo",
              "redo",
              "sourceEditing",
            ],
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          extraPlugins: [CustomUploadAdapterPlugin],
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
