import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  ExternalLink,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  getPopupTemplate,
  postPopupTemplate,
  putPopupTemplate,
  type PopupTemplate,
  type PopupTemplateJsonBody,
} from '../services/api';

const emptyForm = {
  Title: '',
  Body: '',
  ActionLabel: '',
  ActionUrl: '',
  IsActive: true,
  externalImageUrl: '',
};

const PopupMessageSettings = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [templateId, setTemplateId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [clearStoredImage, setClearStoredImage] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setFilePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  const applyData = useCallback((data: PopupTemplate | null) => {
    if (!data || !data._id) {
      setTemplateId(null);
      setForm(emptyForm);
      setServerImageUrl(null);
      return;
    }
    setTemplateId(data._id);
    setForm({
      Title: data.Title ?? '',
      Body: data.Body ?? '',
      ActionLabel: data.ActionLabel ?? '',
      ActionUrl: data.ActionUrl ?? '',
      IsActive: data.IsActive !== false,
      externalImageUrl: '',
    });
    setServerImageUrl(data.ImageUrl ?? null);
  }, []);

  const load = async () => {
    setFetching(true);
    setError('');
    try {
      const res = await getPopupTemplate();
      applyData(res.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load popup template');
      applyData(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patchForm = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setError('');
    setSuccess('');

    const isCreate = !templateId;

    setSaving(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append('Title', form.Title);
        fd.append('Body', form.Body);
        fd.append('ActionLabel', form.ActionLabel);
        fd.append('ActionUrl', form.ActionUrl);
        fd.append('IsActive', String(form.IsActive));
        if (form.externalImageUrl.trim() !== '') {
          fd.append('ImageUrl', form.externalImageUrl.trim());
        }
        fd.append('image', imageFile);

        const res = isCreate ? await postPopupTemplate(fd) : await putPopupTemplate(fd);
        setSuccess(res.message || 'Saved');
        setImageFile(null);
        setClearStoredImage(false);
        if (res.data) applyData(res.data);
        else await load();
      } else {
        const body: PopupTemplateJsonBody = {
          Title: form.Title,
          Body: form.Body,
          ActionLabel: form.ActionLabel,
          ActionUrl: form.ActionUrl,
          IsActive: form.IsActive,
        };
        if (clearStoredImage) {
          body.ImageUrl = null;
        } else if (form.externalImageUrl.trim() !== '') {
          body.ImageUrl = form.externalImageUrl.trim();
        }

        const res = isCreate ? await postPopupTemplate(body) : await putPopupTemplate(body);
        setSuccess(res.message || 'Saved');
        setClearStoredImage(false);
        patchForm({ externalImageUrl: '' });
        if (res.data) applyData(res.data);
        else await load();
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const displayImageSrc = filePreviewUrl ?? (!clearStoredImage ? serverImageUrl : null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} />
      <Header isSidebarExpanded={isSidebarExpanded} onToggleSidebar={toggleSidebar} />

      <div className={`mt-20 p-6 sm:p-8 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Popup message</h1>
                <p className="text-gray-500 text-sm">
                  Manage the in-app popup template —{' '}
                  <code className="text-xs bg-gray-100 px-1 rounded">GET /admin/popup-template</code>,{' '}
                  <code className="text-xs bg-gray-100 px-1 rounded">POST</code>,{' '}
                  <code className="text-xs bg-gray-100 px-1 rounded">PUT</code>
                </p>
              </div>
            </div>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={load}
              disabled={fetching}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={fetching ? 'animate-spin' : ''} size={16} />
              Refresh
            </button>
          </div>

          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
              <RefreshCw className="animate-spin text-violet-600 mb-3" size={32} />
              <p className="text-gray-500 text-sm">Loading popup template…</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 space-y-6">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Popup active</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    checked={form.IsActive}
                    onChange={(e) => patchForm({ IsActive: e.target.checked })}
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g. New offer"
                    value={form.Title}
                    onChange={(e) => patchForm({ Title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Short message shown in the popup"
                    value={form.Body}
                    onChange={(e) => patchForm({ Body: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action label</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="e.g. Open"
                      value={form.ActionLabel}
                      onChange={(e) => patchForm({ ActionLabel: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action URL</label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      placeholder="https://…"
                      value={form.ActionUrl}
                      onChange={(e) => patchForm({ ActionUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-gray-800">
                    <ImageIcon size={18} className="text-violet-600" />
                    Banner image <span className="font-normal text-gray-500">(optional)</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">You can save text and links only; add an image anytime.</p>
                  {displayImageSrc && (
                    <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 max-w-md">
                      <img src={displayImageSrc} alt="Popup banner" className="w-full h-auto max-h-56 object-contain" />
                    </div>
                  )}
                  {clearStoredImage && (
                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                      Stored image URL will be cleared on save. Upload a new image before enabling the popup again if
                      you need a banner.
                    </p>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload image (multipart, optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setImageFile(f);
                          if (f) setClearStoredImage(false);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        If you choose a file, it is sent as <code className="bg-gray-100 px-1 rounded">image</code> on save.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <ExternalLink size={14} />
                        External image URL (optional)
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        placeholder="https://… (stored as-is; use if not uploading a file)"
                        value={form.externalImageUrl}
                        onChange={(e) => patchForm({ externalImageUrl: e.target.value })}
                      />
                    </div>

                    {templateId && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          checked={clearStoredImage}
                          onChange={(e) => {
                            setClearStoredImage(e.target.checked);
                            if (e.target.checked) setImageFile(null);
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700">Clear stored image URL on save</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 flex items-center gap-2 shadow-md"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {templateId ? 'Save changes (PUT)' : 'Create template (POST)'}
                      </>
                    )}
                  </button>
                  <span className="text-xs text-gray-500">
                    {templateId
                      ? 'Updates use PUT. With a file attached, request is multipart; otherwise JSON. Image is optional.'
                      : 'First save uses POST. Image URL and file are optional—backend may still reject an empty template if it requires a banner.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-violet-50 border border-violet-100 rounded-xl p-5 text-sm text-violet-950">
            <p className="font-semibold mb-2">API behaviour</p>
            <ul className="list-disc list-inside space-y-1 text-violet-900/90">
              <li>GET returns the current template including S3 <code className="text-xs bg-white/80 px-1 rounded">ImageUrl</code>.</li>
              <li>POST replaces the single template; image (file, base64, or URL) can be omitted depending on backend rules.</li>
              <li>PUT updates only fields you send; set <code className="text-xs bg-white/80 px-1 rounded">ImageUrl</code> to null or empty to clear it.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMessageSettings;
