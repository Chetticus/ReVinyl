import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useEffect, useRef, useState } from 'react';
import '@/styles/ckeditor.css';

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<any>(null);
  const CKEditorRef = useRef<any>(null);
  const ClassicEditorRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;

    const loadCKEditor = async () => {
      try {
        // Dynamic imports
        const [ckeditorReact, classicEditor] = await Promise.all([
          import('@ckeditor/ckeditor5-react'),
          import('@ckeditor/ckeditor5-build-classic'),
        ]);

        if (!isMounted) return;

        CKEditorRef.current = ckeditorReact.CKEditor;
        ClassicEditorRef.current = classicEditor.default;

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Failed to load CKEditor:', err);
        if (isMounted) {
          setError('Không thể tải trình soạn thảo');
        }
      }
    };

    loadCKEditor();

    return () => {
      isMounted = false;
    };
  }, [isClient]);

  const handleRetry = () => {
    setError(null);
    setIsLoaded(false);

    const retryLoad = async () => {
      try {
        const [ckeditorReact, classicEditor] = await Promise.all([
          import('@ckeditor/ckeditor5-react'),
          import('@ckeditor/ckeditor5-build-classic'),
        ]);

        CKEditorRef.current = ckeditorReact.CKEditor;
        ClassicEditorRef.current = classicEditor.default;
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Retry failed:', err);
        setError('Vẫn không thể tải trình soạn thảo');
      }
    };

    retryLoad();
  };

  if (!isClient) {
    return (
      <div className='border border-gray-300 rounded p-4 text-center'>
        <p>Đang khởi tạo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='border border-red-300 rounded p-4 bg-red-50'>
        <p className='text-red-600 mb-2'>{error}</p>
        <div className='flex gap-2 justify-center mb-4'>
          <Button variant='outline' size='sm' onClick={handleRetry}>
            Thử lại
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
        </div>
        <div>
          <p className='text-sm mb-2 text-gray-600'>
            Sử dụng trình soạn thảo đơn giản:
          </p>
          <Textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={8}
            placeholder={placeholder}
            className='w-full'
          />
        </div>
      </div>
    );
  }

  if (!isLoaded || !CKEditorRef.current || !ClassicEditorRef.current) {
    return (
      <div className='border border-gray-300 rounded p-4 text-center'>
        <p>Đang tải trình soạn thảo...</p>
        <p className='text-sm mt-2 text-gray-500'>Vui lòng đợi...</p>
      </div>
    );
  }

  const CKEditor = CKEditorRef.current;
  const ClassicEditor = ClassicEditorRef.current;

  return (
    <div
      className='border border-gray-300 rounded ckeditor-wrapper'
      style={
        {
          '--ck-min-height': '120px',
        } as React.CSSProperties
      }
    >
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: 'GPL',
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            '|',
            'undo',
            'redo',
          ],
          placeholder: placeholder,
          height: '120px',
          // Ensure list editing works properly
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          // Fix typing in lists
          typing: {
            transformations: {
              include: [
                // Enable all typing transformations including lists
                'quotes',
                'typography',
                'symbols',
                'mathematical',
              ],
            },
          },
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;

          // Ensure the editor is properly focused and editable
          const editingView = editor.editing.view;
          const domRoot = editingView.domRoots.get('main');

          if (domRoot) {
            // Make sure contenteditable is true
            domRoot.setAttribute('contenteditable', 'true');
          }
        }}
        onChange={(event: any, editor: any) => {
          try {
            const data = editor.getData();
            onChange(data);
          } catch (err) {
            console.error('Error getting editor data:', err);
          }
        }}
        onError={(error: any, { willEditorRestart }: any) => {
          console.error('CKEditor error:', error);
          if (!willEditorRestart) {
            setError('Có lỗi xảy ra với trình soạn thảo');
          }
        }}
      />
    </div>
  );
};

export default CKEditorWrapper;
