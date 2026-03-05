# Implementasi Multi-File Upload Display untuk Pendidik

## 📋 Deskripsi Fitur

Fitur ini menampilkan file yang sudah tersimpan di form edit pendidik (terutama untuk kolom "Sertifikat Lainnya" dan "Dokumen Lainnya") dengan UI yang user-friendly, termasuk:

- ✅ Label "Tersimpan" untuk setiap file
- ✅ Nama file yang ditampilkan
- ✅ Tombol "Lihat" untuk preview/download file
- ✅ Tombol "Trash" untuk menghapus file individual
- ✅ Tombol "Hapus Semua" untuk menghapus semua file sekaligus
- ✅ List layout yang rapi untuk multiple files
- ✅ Automatic refresh setelah upload/delete

## 🏗️ Komponen yang Dimodifikasi/Dibuat

### 1. **SavedMultiFileDisplay.vue** (Baru)
```
app/components/common/SavedMultiFileDisplay.vue
```

Komponen reusable untuk menampilkan file yang sudah tersimpan dengan struktur:

```vue
<SavedMultiFileDisplay 
    :files="uploadedFiles['sertifikat_lainnya']"
    :is-loading="isLoading"
    @delete="handleDeleteFile"
    @deleteAll="handleDeleteAllFiles"
/>
```

**Props:**
- `files` (Array) - Array of files to display (bisa berupa object dengan `{name, url}` atau string URLs)
- `isLoading` (Boolean) - Loading state untuk disable buttons

**Events:**
- `@delete` - Emitted ketika user klik delete single file (menerima index)
- `@deleteAll` - Emitted ketika user klik delete all files

### 2. **MultiFileUploadField.vue** (Modified)
```
app/components/common/MultiFileUploadField.vue
```

Diupdate untuk menggunakan `SavedMultiFileDisplay` component:

```diff
- <!-- Inline saved files display (removed) -->
+ <SavedMultiFileDisplay 
+     v-if="uploadedFiles.length > 0" 
+     :files="uploadedFiles"
+     :is-loading="isSubmitting || isUploading"
+     @delete="handleDeleteFile"
+     @deleteAll="handleDeleteAllFiles"
+ />
```

**Benefits:**
- DRY (Don't Repeat Yourself) principle
- Consistent UI across all multi-file fields
- Easier maintenance

### 3. **EditPendidikModal.vue** (Modified)
```
app/components/modals/EditPendidikModal.vue
```

#### A. Initialization (Line ~1033-1052)
Menambah inisialisasi untuk multi-file fields saat modal dibuka:

```ts
// Initialize multiple file fields
multipleFileFields.forEach(field => {
    if (props.pendidik[field.key] && Array.isArray(props.pendidik[field.key])) {
        uploadedFiles.value[field.key] = props.pendidik[field.key]
    } else {
        uploadedFiles.value[field.key] = []
    }
})
```

#### B. Upload Handler (Line ~616-745)
Update `handleFileUpload()` untuk detect multi-file vs single-file:

```ts
// Check if this is a multi-file field
const isMultiFileField = multipleFileFields.some(f => f.key === fieldKey)

if (isMultiFileField && Array.isArray(fileData)) {
    // For multiple file fields, set the array returned from backend
    uploadedFiles.value[fieldKey] = fileData
} else if (!isMultiFileField) {
    // For single file fields, store as object with url/name
    uploadedFiles.value[fieldKey] = {
        url: fileData,
        name: file.name,
        saved: true
    }
}
```

#### C. Delete Handler (Line ~773-807)
Update `handleFileRemoveMulti()` untuk handle beiden format file (object/string):

```ts
const file = uploadedFiles.value[fieldKey]?.[index]
let fileName = ''

if (typeof file === 'object' && file?.name) {
    fileName = file.name
} else if (typeof file === 'string') {
    fileName = file.split('/').pop() || file
}
```

#### D. Delete All Handler (Line ~815-862)
Update `handleFileRemoveAllMulti()` dengan flexible filename extraction.

## 📊 Data Structure

### Backend Return Format untuk Multi-Files

Backend harus return array of file URLs atau objects:

```json
{
    "id": 1,
    "nama": "John Doe",
    "sertifikat_lainnya": [
        "https://api.example.com/files/cert1.pdf",
        "https://api.example.com/files/cert2.pdf"
    ],
    "dokumen_lainnya": [
        {
            "name": "dokumen-1.pdf",
            "url": "https://api.example.com/files/dok1.pdf"
        }
    ]
}
```

### Format yang Di-Support

Komponen `SavedMultiFileDisplay` support beide format:

1. **Array of Strings (URLs)**
   ```ts
   ["https://api.example.com/files/cert1.pdf", "https://api.example.com/files/cert2.pdf"]
   ```

2. **Array of Objects**
   ```ts
   [
       { name: "cert1.pdf", url: "https://api.example.com/files/cert1.pdf", saved: true },
       { name: "cert2.pdf", url: "https://api.example.com/files/cert2.pdf", saved: true }
   ]
   ```

## 🔄 User Flow

### Scenario 1: View Existing Files
```
1. User click "Edit" button di pendidik row
2. Modal terbuka → initializeForm() dipanggil
3. Fetch pendidik data dengan multi-file array
4. Display SavedMultiFileDisplay dengan files
5. User bisa:
   - Klik "Lihat" → Preview file di tab baru
   - Klik "Trash" → Delete file individual
   - Klik "Hapus Semua" → Delete all files
```

### Scenario 2: Upload Additional File
```
1. User upload file baru di upload area
2. handleFileUpload() → upload ke backend
3. Backend return updated pendidik dengan file array terbaru
4. uploadedFiles[fieldKey] updated dengan array baru
5. SavedMultiFileDisplay re-render dengan file baru
```

### Scenario 3: Delete File
```
1. User klik trash icon di file
2. Confirm dialog muncul
3. handleFileRemoveMulti() → API delete ke backend
4. Backend hapus file, return success
5. Frontend splice array, update state
6. SavedMultiFileDisplay re-render
```

## 🎨 UI/UX Features

### File Display Item
- **Green badge** dengan check icon → "Tersimpan"
- **File name** → Truncated dengan ellipsis jika panjang
- **Blue eye icon** → Clickable link ke preview
- **Red trash icon** → Clickable untuk delete

### Multi-File List Layout
```
┌─────────────────────────────────────────────────────────────┐
│ File yang Tersimpan:                    [Hapus Semua Button]│
├─────────────────────────────────────────────────────────────┤
│ ✓ Tersimpan                                    [👁️] [🗑️]   │
│   cert1.pdf                                                  │
├─────────────────────────────────────────────────────────────┤
│ ✓ Tersimpan                                    [👁️] [🗑️]   │
│   cert2.pdf                                                  │
├─────────────────────────────────────────────────────────────┤
│ [+] Klik atau drag file untuk upload                        │
│     PDF (Maks. 1MB per file)                                │
└─────────────────────────────────────────────────────────────┘
```

### Empty State
Jika tidak ada file, hanya upload area yang ditampilkan.

## 🛠️ Implementasi Di Form

### Field Definition
```ts
const multipleFileFields = [
    { key: 'sertifikat_lainnya', label: 'Sertifikat Lainnya' },
    { key: 'dokumen_lainnya', label: 'Dokumen Lainnya' }
]
```

### Form Template
```vue
<MultiFileUploadField 
    v-for="field in multipleFileFields" 
    :key="field.key"
    :field="field" 
    :uploaded-files="uploadedFiles[field.key] || []"
    @upload="(file) => handleFileUpload(field.key, file)" 
    @remove="(fieldKey, index) => handleFileRemoveMulti(fieldKey, index)"
    @removeAll="(fieldKey) => handleFileRemoveAllMulti(fieldKey)"
    :is-submitting="isSubmitting" 
    :is-uploading="uploadingField === field.key" 
/>
```

## 📝 Testing Checklist

- [ ] Open edit pendidik modal
- [ ] Verify saved multi-files display with "Tersimpan" label
- [ ] Click eye icon → File opens in new tab
- [ ] Click trash icon on single file → File deleted + array updated
- [ ] Click "Hapus Semua" → All files deleted
- [ ] Upload new file → Added to array + re-rendered
- [ ] Multiple files display → All shown in list
- [ ] Loading state → Buttons disabled during upload/delete
- [ ] Toast notifications → Success/error messages shown

## 🐛 Troubleshooting

### Files tidak tampil setelah upload
**Cause:** Backend return format berbeda
**Solution:** Check backend return format, ensure array structure sesuai dokumentasi

### Filename extraction error
**Cause:** File object tidak memiliki property `name`
**Solution:** Komponen sudah handle beiden format (string URL atau object), tapi verify backend return

### Delete tidak bekerja
**Cause:** Backend tidak recognize fieldKey_to_delete
**Solution:** Verify backend delete endpoint menerima format:
```json
{
    "id": 1,
    "sertifikat_lainnya_to_delete": ["cert1.pdf"]
}
```

## 🚀 Future Enhancements

1. **Drag & Drop untuk reorder files** - Implementasi dengan Vue Draggable
2. **File preview** - Show thumbnail untuk image files
3. **Batch upload** - Multiple files sekaligus
4. **Progress bar** - Show upload progress per file
5. **File size validation** - Visual indicator jika file terlalu besar

## 📚 Referensi File

| File | Tujuan |
|------|--------|
| `app/components/common/SavedMultiFileDisplay.vue` | Display files yang tersimpan |
| `app/components/common/MultiFileUploadField.vue` | Upload area + saved files |
| `app/components/modals/EditPendidikModal.vue` | Main form dengan handlers |

## 💡 Notes untuk Developer

1. **Flexibility dalam data format** - Komponen bisa handle string URLs atau object files
2. **Event-driven** - Components emit events, parent handle logic
3. **Separation of concerns** - SavedMultiFileDisplay hanya display, logic di parent
4. **Reusable** - SavedMultiFileDisplay bisa digunakan di form lain dengan multi-file

---

**Last Updated:** March 2026
**Version:** 1.0.0
