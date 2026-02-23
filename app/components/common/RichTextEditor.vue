<template>
    <div class="rich-text-editor">
        <!-- Toolbar with horizontal scroll on mobile -->
        <div class="editor-toolbar bg-gray-100 border border-gray-300 rounded-t-lg overflow-x-auto">
            <div class="flex gap-1 p-2 min-w-max sm:min-w-0 sm:flex-wrap">
                <!-- Format Dropdown -->
                <select @change="applyFormat" value=""
                    class="px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 flex-shrink-0">
                    <option value="">Heading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="heading1">H1</option>
                    <option value="heading2">H2</option>
                    <option value="heading3">H3</option>
                </select>



                <!-- Text Formatting -->
                <button @click="editor?.chain().focus().toggleBold().run()"
                    :class="['editor-btn', editor?.isActive('bold') ? 'active' : '']" title="Bold" type="button">
                    <i class="fa-solid fa-bold text-xs sm:text-sm"></i>
                </button>

                <button @click="editor?.chain().focus().toggleItalic().run()"
                    :class="['editor-btn', editor?.isActive('italic') ? 'active' : '']" title="Italic" type="button">
                    <i class="fa-solid fa-italic text-xs sm:text-sm"></i>
                </button>

                <button @click="editor?.chain().focus().toggleUnderline().run()"
                    :class="['editor-btn', editor?.isActive('underline') ? 'active' : '']" title="Underline"
                    type="button">
                    <i class="fa-solid fa-underline text-xs sm:text-sm"></i>
                </button>

                <button @click="editor?.chain().focus().toggleSuperscript().run()"
                    :class="['editor-btn', editor?.isActive('superscript') ? 'active' : '']" title="Superscript"
                    type="button">
                    <i class="fa-solid fa-superscript text-xs sm:text-sm"></i>
                </button>

                <button @click="editor?.chain().focus().toggleSubscript().run()"
                    :class="['editor-btn', editor?.isActive('subscript') ? 'active' : '']" title="Subscript"
                    type="button">
                    <i class="fa-solid fa-subscript text-xs sm:text-sm"></i>
                </button>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Text Align -->
                <div class="flex gap-0.5">
                    <button @click="editor?.chain().focus().setTextAlign('left').run()"
                        :class="['editor-btn', editor?.isActive({ textAlign: 'left' }) ? 'active' : '']"
                        title="Align Left" type="button">
                        <i class="fa-solid fa-align-left text-xs sm:text-sm"></i>
                    </button>

                    <button @click="editor?.chain().focus().setTextAlign('center').run()"
                        :class="['editor-btn', editor?.isActive({ textAlign: 'center' }) ? 'active' : '']"
                        title="Align Center" type="button">
                        <i class="fa-solid fa-align-center text-xs sm:text-sm"></i>
                    </button>

                    <button @click="editor?.chain().focus().setTextAlign('right').run()"
                        :class="['editor-btn', editor?.isActive({ textAlign: 'right' }) ? 'active' : '']"
                        title="Align Right" type="button">
                        <i class="fa-solid fa-align-right text-xs sm:text-sm"></i>
                    </button>

                    <button @click="editor?.chain().focus().setTextAlign('justify').run()"
                        :class="['editor-btn', editor?.isActive({ textAlign: 'justify' }) ? 'active' : '']"
                        title="Justify" type="button">
                        <i class="fa-solid fa-align-justify text-xs sm:text-sm"></i>
                    </button>
                </div>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Colors -->
                <input type="color" @input="changeColor" :value="currentColor"
                    class="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded cursor-pointer hover:border-gray-400 flex-shrink-0"
                    title="Text Color" />

                <input type="color" @input="changeHighlight" :value="currentHighlight"
                    class="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded cursor-pointer hover:border-gray-400 flex-shrink-0"
                    title="Highlight" />

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Blockquote -->
                <button @click="editor?.chain().focus().toggleBlockquote().run()"
                    :class="['editor-btn', editor?.isActive('blockquote') ? 'active' : '']" title="Blockquote"
                    type="button">
                    <i class="fa-solid fa-quote-left text-xs sm:text-sm"></i>
                </button>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Lists -->
                <button @click="editor?.chain().focus().toggleBulletList().run()"
                    :class="['editor-btn', editor?.isActive('bulletList') ? 'active' : '']" title="Bullet List"
                    type="button">
                    <i class="fa-solid fa-list-ul text-xs sm:text-sm"></i>
                </button>

                <button @click="editor?.chain().focus().toggleOrderedList().run()"
                    :class="['editor-btn', editor?.isActive('orderedList') ? 'active' : '']"
                    title="Ordered List (1,2,3...)" type="button">
                    <i class="fa-solid fa-list-ol text-xs sm:text-sm"></i>
                </button>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Indent/Dedent with Style Selector -->
                <div class="flex gap-0.5">
                    <button @click="toggleIndentStyle"
                        :class="['editor-btn text-xs px-1.5', indentStyle === 'plain' ? 'bg-yellow-100' : indentStyle === 'bullet' ? 'bg-blue-100' : 'bg-green-100']"
                        :title="`Indent Style: ${indentStyleLabel}`" type="button">
                        <i :class="[
                            'text-xs sm:text-sm',
                            indentStyle === 'plain' ? 'fa-solid fa-square' : indentStyle === 'bullet' ? 'fa-solid fa-circle' : 'fa-solid fa-list-ol'
                        ]"></i>
                    </button>

                    <button @click="editor?.chain().focus().sinkListItem('listItem').run()"
                        :disabled="!editor?.can().sinkListItem('listItem')"
                        class="editor-btn disabled:opacity-50 disabled:cursor-not-allowed" title="Indent (Tab)"
                        type="button">
                        <i class="fa-solid fa-indent text-xs sm:text-sm"></i>
                    </button>

                    <button @click="editor?.chain().focus().liftListItem('listItem').run()"
                        :disabled="!editor?.can().liftListItem('listItem')"
                        class="editor-btn disabled:opacity-50 disabled:cursor-not-allowed" title="Dedent (Shift+Tab)"
                        type="button">
                        <i class="fa-solid fa-outdent text-xs sm:text-sm"></i>
                    </button>
                </div>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Link -->
                <button @click="showLinkDialog" :class="['editor-btn', editor?.isActive('link') ? 'active' : '']"
                    title="Insert Link" type="button">
                    <i class="fa-solid fa-link text-xs sm:text-sm"></i>
                </button>



                <div class="hidden sm:block w-px border-l border-gray-300"></div>

                <!-- Soft Break -->
                <button @click="editor?.chain().focus().setHardBreak().run()" class="editor-btn"
                    title="Soft Break (Shift+Enter)" type="button">
                    <i class="fa-solid fa-arrow-turn-down text-xs sm:text-sm"></i>
                </button>

                <!-- Clear Format -->
                <button @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()" class="editor-btn"
                    title="Clear Format" type="button">
                    <i class="fa-solid fa-eraser text-xs sm:text-sm"></i>
                </button>
            </div>
        </div>

        <!-- Indent Style Dropdown (Mobile) -->
        <div class="bg-gray-50 border-b border-gray-300 px-2 py-1.5 sm:hidden flex gap-2 items-center text-xs">
            <span class="text-gray-700 font-medium">Indent:</span>
            <select v-model="indentStyle"
                class="px-2 py-1 border border-gray-300 rounded text-xs bg-white hover:bg-gray-100">
                <option value="plain">Plain (No marker)</option>
                <option value="bullet">Bullet (•)</option>
                <option value="number">Numbering (a,b,c...)</option>
            </select>
        </div>

        <!-- Editor -->
        <EditorContent :editor="editor" class="editor-content" />

        <!-- Help Text -->
        <div class="bg-blue-50 border-t border-blue-200 px-3 py-2 text-xs sm:text-sm text-blue-900 rounded-b-lg">
            <p class="font-semibold">💡 Soft Break:</p>
            <p>Tekan <kbd class="bg-white border border-blue-300 px-1.5 py-0.5 rounded text-xs">Shift+Enter</kbd>
                untuk baris baru dalam item yang sama. Tekan <kbd
                    class="bg-white border border-blue-300 px-1.5 py-0.5 rounded text-xs">Enter</kbd> untuk item baru.
            </p>
        </div>

        <!-- Link Dialog -->
        <div v-if="showLinkInput"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Sisipkan Link</h3>
                <p class="text-xs text-gray-500 mb-4">Masukkan URL lengkap atau domain (contoh: google.com)</p>
                <input v-model="linkUrl" type="text" placeholder="https://example.com atau example.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 text-sm"
                    @keyup.enter="applyLink" autofocus />
                <p v-if="linkUrl" class="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                    Link akan dibuka: <span class="font-mono text-red-600">{{ linkUrl.match(/^(https?|ftp):\/\//) ?
                        linkUrl : 'https://' + linkUrl }}</span>
                </p>
                <div class="flex gap-3">
                    <button @click="cancelLink"
                        class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Batal
                    </button>
                    <button @click="applyLink" :disabled="!linkUrl.trim()"
                        class="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TextStyle } from '@tiptap/extension-text-style'
import { ref, watch, onBeforeUnmount, computed } from 'vue'

interface Props {
    modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const currentColor = ref('#000000')
const currentHighlight = ref('#ffff00')
const indentStyle = ref<'plain' | 'bullet' | 'number'>('plain')
const showLinkInput = ref(false)
const linkUrl = ref('')

const indentStyleLabel = computed(() => {
    switch (indentStyle.value) {
        case 'bullet':
            return 'Bullet (•)'
        case 'number':
            return 'Numbering (a,b,c...)'
        case 'plain':
        default:
            return 'Plain'
    }
})



const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: true,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: true,
            },
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Color,
        Highlight.configure({
            multicolor: true,
        }),
        Underline,
        TextStyle.configure({
            types: ['textStyle'],
        }),
        Link.configure({
          openOnClick: true,
          defaultProtocol: 'https',
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: 'editor-link',
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: 'editor-blockquote',
          }
        }),
        Superscript,
        Subscript,
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

// Watch modelValue prop changes
watch(
    () => props.modelValue,
    (newVal) => {
        if (editor.value && newVal !== editor.value.getHTML()) {
            editor.value.commands.setContent(newVal, false)
        }
    }
)

const applyFormat = (event: Event) => {
    const select = event.target as HTMLSelectElement
    const value = select.value

    if (!editor.value) return

    switch (value) {
        case 'paragraph':
            editor.value.chain().focus().setParagraph().run()
            break
        case 'heading1':
            editor.value.chain().focus().toggleHeading({ level: 1 }).run()
            break
        case 'heading2':
            editor.value.chain().focus().toggleHeading({ level: 2 }).run()
            break
        case 'heading3':
            editor.value.chain().focus().toggleHeading({ level: 3 }).run()
            break
    }

    select.value = ''
}



const changeColor = (event: Event) => {
    const input = event.target as HTMLInputElement
    const color = input.value

    currentColor.value = color

    if (!editor.value) return

    editor.value.chain().focus().setColor(color).run()
}

const changeHighlight = (event: Event) => {
    const input = event.target as HTMLInputElement
    const color = input.value

    currentHighlight.value = color

    if (!editor.value) return

    editor.value.chain().focus().toggleHighlight({ color }).run()
}

const toggleIndentStyle = () => {
    const styles: Array<'plain' | 'bullet' | 'number'> = ['plain', 'bullet', 'number']
    const currentIndex = styles.indexOf(indentStyle.value)
    indentStyle.value = styles[(currentIndex + 1) % styles.length]
    applyListStyle()
}

const applyListStyle = () => {
    if (!editor.value) return

    // Get the current list
    const { $from } = editor.value.state.selection
    let listPos = -1

    // Find parent list node
    editor.value.state.doc.nodesBetween($from.pos - 100, $from.pos + 100, (node, pos) => {
        if ((node.type.name === 'bulletList' || node.type.name === 'orderedList') && pos < $from.pos) {
            listPos = pos
        }
    })

    if (listPos === -1) return

    // Get current list depth/level
    const depth = $from.depth
    const currentStyle = indentStyle.value

    // Update this list's type based on style
    updateListType()
}

const updateListType = () => {
    if (!editor.value) return

    const { $from } = editor.value.state.selection

    if (indentStyle.value === 'plain') {
        // Remove list styling (keep as indented text)
        // Keep existing list but with custom styling via CSS
        editor.value.chain().focus().run()
    } else if (indentStyle.value === 'bullet') {
        // Ensure it's a bullet list
        if (!editor.value.isActive('bulletList')) {
            editor.value.chain()
                .focus()
                .toggleBulletList()
                .run()
        }
    } else if (indentStyle.value === 'number') {
        // Ensure it's an ordered list
        if (!editor.value.isActive('orderedList')) {
            editor.value.chain()
                .focus()
                .toggleOrderedList()
                .run()
        }
    }
}

const showLinkDialog = () => {
    if (!editor.value) return

    const { from, to } = editor.value.state.selection

    // Check if there's selected text
    if (from === to) {
        alert('Pilih teks terlebih dahulu untuk membuat link!')
        return
    }

    // Get URL dari link existing jika ada
    const previousUrl = editor.value.getAttributes('link').href

    if (previousUrl) {
        // Ada link existing - untuk edit
        linkUrl.value = previousUrl
    } else {
        // Link baru - clear input
        linkUrl.value = ''
    }

    showLinkInput.value = true

    // Auto-focus input (akan dihandle dengan autofocus attribute)
}

const applyLink = () => {
    try {
        if (!editor.value) {
            cancelLink()
            return
        }

        if (!linkUrl.value.trim()) {
            // Remove link if URL is empty
            editor.value.chain().focus().unsetLink().run()
        } else {
            // Ensure URL has protocol
            let url = linkUrl.value.trim()
            if (!url.match(/^(https?|ftp):\/\//)) {
                url = 'https://' + url
            }

            // Apply link to selected text using toggleLink command
            // This properly applies link to current selection
            editor.value
                .chain()
                .focus()
                .toggleLink({ href: url })
                .run()
        }
    } catch (error) {
        console.error('Error applying link:', error)
    } finally {
        // Always close the dialog
        cancelLink()
    }
}

const cancelLink = () => {
    showLinkInput.value = false
    linkUrl.value = ''
}





onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<style scoped>
.rich-text-editor {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
}

.editor-toolbar {
    background: #f3f4f6;
    border-bottom: 1px solid #d1d5db;
}

.editor-btn {
    padding: 0.375rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    min-height: 1.75rem;
    flex-shrink: 0;
}

.editor-btn:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
}

.editor-btn:active:not(:disabled),
.editor-btn.active {
    background: #ef4444;
    color: white;
    border-color: #dc2626;
}

.editor-content :deep(.ProseMirror) {
    padding: 0.75rem;
    min-height: 180px;
    background: white;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #111827;
    outline: none;
}

.editor-content :deep(.ProseMirror:focus) {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
}

.editor-content :deep(h1) {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.5rem 0;
}

.editor-content :deep(h2) {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0.5rem 0;
}

.editor-content :deep(h3) {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0.5rem 0;
}

.editor-content :deep(p) {
    margin: 0.5rem 0;
}

/* Default List Styles */
.editor-content :deep(ul) {
    list-style: disc;
    list-style-position: inside;
    margin: 0.5rem 0 0.5rem 1.5rem;
}

.editor-content :deep(ul li) {
    list-style: disc;
    list-style-position: inherit;
}

.editor-content :deep(ol) {
    list-style: decimal !important;
    list-style-position: inside;
    margin: 0.5rem 0 0.5rem 1.5rem;
}

.editor-content :deep(ol li) {
    list-style: decimal !important;
    list-style-position: inherit;
    display: list-item;
}

.editor-content :deep(li) {
    margin: 0.25rem 0;
    line-height: 1.6;
    display: list-item;
}

.editor-content :deep(li p) {
    margin: 0;
    display: inline;
}

/* Link Styles */
.editor-content :deep(a),
.editor-content :deep(.editor-link) {
    color: #dc2626;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;
    font-weight: 500;
}

.editor-content :deep(a:hover),
.editor-content :deep(.editor-link:hover) {
    color: #991b1b;
    text-decoration-thickness: 2px;
}

/* Blockquote Styles */
.editor-content :deep(blockquote) {
    padding: 0.75rem 1rem;
    margin: 0.5rem 0;
    border-left: 4px solid #dc2626;
    background-color: #fee2e2;
    font-style: italic;
    color: #7f1d1d;
}

/* Superscript & Subscript */
.editor-content :deep(sup) {
    font-size: 0.75em;
    vertical-align: super;
}

.editor-content :deep(sub) {
    font-size: 0.75em;
    vertical-align: sub;
}

/* Nested List Styles - Indent with different markers */
.editor-content :deep(ul ul),
.editor-content :deep(ol ol),
.editor-content :deep(ul ol),
.editor-content :deep(ol ul) {
    margin: 0.25rem 0 0.25rem 2rem;
}

/* Second level - Circles for bullets */
.editor-content :deep(ul ul),
.editor-content :deep(ol ul) {
    list-style-type: circle;
}

.editor-content :deep(ul ul li),
.editor-content :deep(ol ul li) {
    list-style-type: circle;
}

/* Second level ordered - use letters */
.editor-content :deep(ul ol),
.editor-content :deep(ol ol) {
    list-style-type: lower-alpha;
}

.editor-content :deep(ul ol li),
.editor-content :deep(ol ol li) {
    list-style-type: lower-alpha;
}

/* Third level - use roman numerals */
.editor-content :deep(ul ul ul),
.editor-content :deep(ol ol ol),
.editor-content :deep(ul ol ul),
.editor-content :deep(ol ul ol) {
    list-style-type: lower-roman;
}

/* Plain indent (no marker) */
.editor-content :deep(.indent-plain) {
    list-style: none;
    margin-left: 2rem;
}

.editor-content :deep(.indent-plain li) {
    margin-left: 0;
    list-style: none;
}

@media (max-width: 640px) {
    .editor-content :deep(.ProseMirror) {
        padding: 0.625rem;
        min-height: 160px;
        font-size: 0.875rem;
    }
}
</style>
