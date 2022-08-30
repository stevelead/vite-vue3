<script lang="ts" setup>
import PostWriter from '../components/PostWriter.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { usePosts } from '../stores/posts'
import { Post } from '../posts'

const router = useRouter()
const route = useRoute()
const postsStore = usePosts()

const id = route.params.id as string
const post = postsStore.all.get(id)

if (!post) {
  throw Error(`Post with id ${id} was not found`)
}

async function handleSubmit(post: Post) {
  await postsStore.updatePost(post)
  router.push('/')
}
</script>

<template>
  Edit Post
  <PostWriter :post="post" @submit="handleSubmit" />
</template>
