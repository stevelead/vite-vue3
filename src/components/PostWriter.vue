<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue'
import { Post, TimelinePost } from '../posts'
import { marked } from 'marked'
import highlightjs from 'highlight.js'
import { debounce } from 'lodash'
import { useUsers } from '../stores/users'

const props = defineProps<{
  post: TimelinePost | Post
}>()

const emit = defineEmits<{
  (event: 'submit', post: Post): void
}>()

const title = ref(props.post.title)
const content = ref(props.post.markdown)
const html = ref('')
const contentEditable = ref<HTMLDivElement>()

const usersStore = useUsers()

function parseHTML(markdown: string) {
  marked.parse(
    markdown,
    {
      gfm: true,
      breaks: true,
      highlight: (code) => {
        return highlightjs.highlightAuto(code).value
      },
    },
    (err, parseResult) => {
      html.value = parseResult
    }
  )
}

watch(
  content,
  debounce((newContent) => {
    parseHTML(newContent)
  }, 2500),
  { immediate: true }
)

onMounted(() => {
  if (!contentEditable.value) {
    throw Error('contentEditable DOM node not found')
  }
  contentEditable.value.innerText = content.value
})

function handleInput() {
  if (!contentEditable.value) {
    throw Error('contentEditable DOM node not found')
  }
  content.value = contentEditable.value?.innerText
}

async function handleClick() {
  if (!usersStore.currentUserId) {
    throw Error('User was not found')
  }

  const newPost: Post = {
    ...props.post,
    created: typeof props.post.created === 'string' ? props.post.created : props.post.created.toISO(),
    title: title.value,
    authorId: usersStore.currentUserId,
    markdown: content.value,
    html: html.value,
  }
  emit('submit', newPost)
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Post title</div>
        <input v-model="title" type="text" class="input" />
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div contenteditable ref="contentEditable" @input="handleInput" />
    </div>
    <div class="column">
      <div v-html="html" />
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <button class="button is-primary is-pulled-right" @click="handleClick">Save Post</button>
    </div>
  </div>
</template>
