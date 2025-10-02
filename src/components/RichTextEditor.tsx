"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import 'suneditor/dist/css/suneditor.min.css'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] border rounded-lg bg-gray-50 dark:bg-gray-900 animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  )
})

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: string
  onImageUpload?: (file: File) => Promise<string>
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  height = "500",
  onImageUpload 
}: RichTextEditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false)

  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  const handleImageUploadBefore = (files: File[], info: any, uploadHandler: any) => {
    if (!onImageUpload) {
      // Use default behavior if no custom upload handler
      uploadHandler(files)
      return undefined
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const url = await onImageUpload(file)
        return {
          url,
          name: file.name,
          size: file.size
        }
      } catch (error) {
        console.error('Image upload failed:', error)
        return null
      }
    })

    Promise.all(uploadPromises).then((results) => {
      const validResults = results.filter(r => r !== null)
      const response = {
        result: validResults.map(r => ({
          url: r!.url,
          name: r!.name,
          size: r!.size
        }))
      }
      uploadHandler(response)
    })

    return undefined // Prevent default upload
  }

  const editorOptions: any = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'],
      ['fontColor', 'hiliteColor'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'table'],
      ['link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print'],
    ],
    formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    font: [
      'Arial',
      'Comic Sans MS',
      'Courier New',
      'Georgia',
      'Impact',
      'Tahoma',
      'Times New Roman',
      'Verdana'
    ],
    fontSize: [8, 10, 14, 16, 18, 20, 24, 28, 36, 48, 72],
    colorList: [
      ['#000000', '#444444', '#666666', '#999999', '#CCCCCC', '#EEEEEE', '#F3F3F3', '#FFFFFF'],
      ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF'],
      ['#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#CFE2F3', '#D9D2E9', '#EAD1DC'],
      ['#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#9FC5E8', '#B4A7D6', '#D5A6BD'],
      ['#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6FA8DC', '#8E7CC3', '#C27BA0'],
      ['#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3D85C6', '#674EA7', '#A64D79'],
      ['#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#0B5394', '#351C75', '#741B47'],
      ['#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#073763', '#20124D', '#4C1130']
    ],
    imageGalleryUrl: '',
    imageUploadSizeLimit: 5 * 1024 * 1024, // 5MB
    imageAccept: '.jpg,.jpeg,.png,.gif,.webp',
    mode: 'classic',
    charCounter: true,
    charCounterLabel: 'Characters: ',
    width: '100%',
    height: height,
    minHeight: '300px',
    placeholder: placeholder,
    defaultStyle: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6;',
    attributesWhitelist: {
      all: 'style',
      table: 'cellpadding|cellspacing|border|style',
      img: 'src|alt|style|width|height|loading',
      a: 'href|target|rel|style',
      span: 'style',
      p: 'style',
      h1: 'style',
      h2: 'style',
      h3: 'style',
      h4: 'style',
      h5: 'style',
      h6: 'style'
    }
  }

  if (!editorLoaded) {
    return (
      <div className="min-h-[500px] border rounded-lg bg-gray-50 dark:bg-gray-900 animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="sun-editor-wrapper">
      <style jsx global>{`
        .sun-editor {
          border-radius: 0.5rem !important;
          border: 1px solid hsl(var(--border)) !important;
        }
        .sun-editor .se-toolbar {
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
        }
        .sun-editor .se-btn {
          color: hsl(var(--foreground)) !important;
        }
        .sun-editor .se-btn:hover {
          background-color: hsl(var(--accent)) !important;
        }
        .dark .sun-editor {
          background-color: hsl(var(--background)) !important;
        }
        .dark .sun-editor .se-wrapper {
          background-color: hsl(var(--background)) !important;
        }
        .dark .sun-editor .se-wrapper .se-wrapper-inner {
          background-color: hsl(var(--background)) !important;
        }
        .dark .sun-editor .se-wrapper .se-wrapper-inner .se-wrapper-wysiwyg {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        .dark .se-resizing-bar {
          background-color: hsl(var(--border)) !important;
        }
        .sun-editor-editable {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          padding: 1.5rem !important;
        }
        .sun-editor-editable pre {
          background-color: #1e1e1e !important;
          color: #d4d4d4 !important;
          border-radius: 0.375rem !important;
          padding: 1rem !important;
        }
        .dark .sun-editor-editable pre {
          background-color: #0a0a0a !important;
        }
        .sun-editor-editable code {
          background-color: rgba(0, 0, 0, 0.05) !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.875em !important;
        }
        .dark .sun-editor-editable code {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #f97316 !important;
        }
      `}</style>
      <SunEditor
        setContents={value}
        onChange={onChange}
        setOptions={editorOptions}
        onImageUploadBefore={handleImageUploadBefore}
      />
    </div>
  )
}