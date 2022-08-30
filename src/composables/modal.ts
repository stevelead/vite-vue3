import { ref, shallowRef } from 'vue'
import SigninForm from '../components/SigninForm.vue'
import SignupForm from '../components/SignupForm.vue'

const show = ref(false)
const component = shallowRef()

export function useModal() {
  return {
    show,
    component,
    showModal: (type: 'signUp' | 'signIn') => {
      show.value = true
      switch (type) {
        case 'signIn':
          return component.value = SigninForm
        case 'signUp':
          return component.value = SignupForm
      }
    },
    hideModal: () => (show.value = false),
  }
}
